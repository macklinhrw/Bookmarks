(ns hello
  (:require 
    [datascript.core :as d]))

(defn bookmark [] 
  (let [conn (d/create-conn)
        item {:db/id -1 :title "Title" :url "https://google.com"}]
    (d/transact! conn [item])
    (let [result (d/q '[:find ?e ?title :where [?e :title ?title]] (d/db conn))]
      (println (d/datoms (d/db conn) :eavt))
      (println result))))

(bookmark)
; => #{[1 Title]}

(def exports #js {
                  :bookmark bookmark
                  })
