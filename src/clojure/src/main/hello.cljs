(ns hello
  (:require 
    [datascript.core :as d]))


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

(defn query-title [title]
  (let [result (d/q titleq (d/db conn) title)]
    (clj->js result)))

(defn query-url [url]
  (let [result (d/q urlq (d/db conn) url)]
    (clj->js result)))

(defn transact [item]
  (d/transact! conn item))

(db-init)

(def exports #js {:queryTitle query-title
                  :queryUrl query-url
                  :transact transact
                  :conn conn
                  :items items
                  :init db-init})

