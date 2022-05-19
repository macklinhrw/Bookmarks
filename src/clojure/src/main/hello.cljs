(ns hello)

(defn hello []
  (+ 1 2))

(defn printHello []
  (println "Hello, World!"))

(def exports #js {
                  :hello hello
                  :printHello printHello
                  })
