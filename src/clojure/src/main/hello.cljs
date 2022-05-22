(ns hello
  (:require 
    [datascript.core :as d]
    [clojure.walk :as walk]
    [goog.object :as go]
    [clojure.pprint :as p]))

; Code from https://github.com/tonsky/datascript/blob/master/src/datascript/js.cljs
; Javascript API and conversions

(defn- keywordize [s]
  (if (and (string? s) (= (subs s 0 1) ":"))
    (keyword (subs s 1))
    s))

(defn- schema->clj [schema]
  (->> (js->clj schema)
       (reduce-kv
         (fn [m k v] (assoc m k (walk/postwalk keywordize v))) {})))

(declare entities->clj)

(defn- entity-map->clj [e]
  (walk/postwalk
    (fn [form]
      (if (and (map? form) (contains? form ":db/id"))
        (-> form
            (dissoc ":db/id")
            (assoc  :db/id (get form ":db/id")))
        form))
    e))

(defn- entity->clj [e]
  (cond
    (map? e)
    (entity-map->clj e)

    (= (first e) ":db.fn/call")
    (let [[_ f & args] e]
      (concat [:db.fn/call (fn [& args] (entities->clj (apply f args)))] args))

    (sequential? e)
    (let [[op & entity] e]
      (concat [(keywordize op)] entity))))

(defn- entities->clj [entities]
  (->> (js->clj entities)
       (map entity->clj)))

(defn- tempids->js [tempids]
  (let [obj (js-obj)]
    (doseq [[k v] tempids]
      (go/set obj (str k) v))
    obj))

(defn- tx-report->js [report]
  #js { :db_before (:db-before report)
        :db_after  (:db-after report)
        :tx_data   (->> (:tx-data report) into-array)
        :tempids   (tempids->js (:tempids report))
        :tx_meta   (:tx-meta report) })

(defn js->Datom [d]
  (if (array? d)
    (d/datom (aget d 0) (aget d 1) (aget d 2) (or (aget d 3) d/tx0) (or (aget d 4) true))
    (d/datom (.-e d) (.-a d) (.-v d) (or (.-tx d) d/tx0) (or (.-added d) true))))

(defn- pull-result->js
  [result]
  (->> result
       (walk/postwalk #(if (keyword? %) (str %) %))
       clj->js))

; End conversions


(def conn (d/create-conn))
(def items [{:db/id -1 :title "new" :url "https://facebook.com"}
            {:db/id -2 :title "hello" :url "https://google.com"}
            {:db/id -3 :title "world" :url "https://youtube.com"}
            {:db/id -4 :title "this" :url "https://twitch.tv"}
            {:db/id -5 :title "is" :url "https://twitter.com"}
            {:db/id -6 :title "a different" :url "https://google.com"}
            {:db/id -7 :title "title" :url "https://goog.com"}
            {:db/id -8 :title "that the last" :url "https://googl.com"}])

(defn db-init []
  (d/transact! conn items))

(def titleq '[:find ?e ?title ?url :in $ ?pattern :where [?e :title ?title]
              [(str "(?i)" ?pattern) ?np]
              [(re-pattern ?np) ?rp]
              [(re-find ?rp ?title)]
              [?e :url ?url]])

(def urlq   '[:find ?e ?title ?url :in $ ?pattern :where [?e :url ?url]
              [(str "(?i)" ?pattern) ?np]
              [(re-pattern ?np) ?rp]
              [(re-find ?rp ?url)]
              [?e :title ?title]])

(def searchq   '[:find ?e ?title ?url ?isFolder :in $ ?pattern :where 
                 (or [?e :url ?field]
                     [?e :title ?field])
                 [(str "(?i)" ?pattern) ?np]
                 [(re-pattern ?np) ?rp]
                 [(re-find ?rp ?field)]
                 [?e :title ?title]
                 [?e :url ?url]
                 [?e :isFolder ?isFolder]])

(def id-chromeidq  '[:find ?e :in $ ?id :where [?e :chromeid ?id]])

(defn query-title [title]
  (let [result (d/q titleq (d/db conn) title)]
    (clj->js result)))

(defn query-url [url]
  (let [result (d/q urlq (d/db conn) url)]
    (clj->js result)))

(defn query [url]
  (let [result (d/q searchq (d/db conn) url)]
    (clj->js (take 50 result))))

(defn query-chromeid [id]
  (let [result (d/q id-chromeidq (d/db conn) id)] result))

(defn find-id [chromeid]
  (let [result (query-chromeid chromeid)]
    (-> (take 1 result)
        first
        first)))

(defn add-bookmark [title url chromeId chromeDateAdded chromeParentId isFolder tag notes]
  (d/transact! conn [{:db/id -1 :title title :url url :chromeId chromeId :chromeDataAdded chromeDateAdded 
                      :chromeParentId chromeParentId :isFolder isFolder :tag tag :notes notes }]))

(defn remove-bookmark [chromeid]
  (let [result (find-id chromeid)]
    (if (some? result)
      (d/transact! conn [[:db/retractEntity result]])
      (print "Bookmark with chromeid" chromeid "doesn't exist"))))

(def exports #js {:queryTitle query-title
                  :queryUrl query-url
                  :conn conn
                  :items items
                  :query query
                  :addBookmark add-bookmark
                  :removeBookmark remove-bookmark})

