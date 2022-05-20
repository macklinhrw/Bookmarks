(ns hello
  (:require 
    [datascript.core :as d]))

(def conn (d/create-conn))
(def items [{:db/id -1 :title "new" :url "https://google.com"}])

(defn db-init []
  (d/transact! conn items))

(def titleq '[:find ?e ?title :in $ ?pattern :where [?e :title ?title]
              [(clojure.core/format "(?i)%s" ?pattern) ?np]
              [(re-pattern ?np) ?rp]
              [(re-find ?rp ?title)]])

(def urlq   '[:find ?e ?url :in $ ?pattern :where [?e :url ?url]
              [(clojure.core/format "(?i)%s" ?pattern) ?np]
              [(re-pattern ?np) ?rp]
              [(re-find ?rp ?url)]])

(defn query-title []
  (try (-> (let [result (d/q titleq (d/db conn) "tit")] result))
       (catch Exception error
         (println error))))

(defn query-url [url]
  (let [result (d/q urlq (d/db conn) url)]
    (clj->js result)))

(defn transact [item]
  (d/transact! conn item))

(db-init)
(query-title)

(def exports #js {:queryTitle query-title
                  :queryUrl query-url
                  :transact transact
                  :conn conn
                  :items items
                  :init db-init})

