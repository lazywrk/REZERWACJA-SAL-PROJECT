(defproject export-service-clojure "0.1.0-SNAPSHOT"
  :description "Clojure Export Microservice"

  :dependencies [[org.clojure/clojure "1.11.1"]

                 ;; HTTP server
                 [ring/ring-core "1.12.1"]
                 [ring/ring-jetty-adapter "1.12.1"]

                 ;; Routing
                 [compojure "1.7.1"]

                 ;; JSON
                 [cheshire "5.12.0"]
                 [ring/ring-json "0.5.1"]

                 ;; CSV
                 [org.clojure/data.csv "1.1.0"]

                 [clj-pdf "2.7.0"]

                 ;; HTTP
                 [clj-http "3.13.0"]]

  :main ^:skip-aot export-service-clojure.core

  :target-path "target/%s"

  :profiles {:uberjar {:aot :all}})