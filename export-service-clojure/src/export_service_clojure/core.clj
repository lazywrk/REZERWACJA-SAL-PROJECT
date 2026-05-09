(ns export-service-clojure.core
  (:require
   [ring.adapter.jetty :refer [run-jetty]]
   [compojure.core :refer [GET defroutes]]
   [compojure.route :as route]
   [ring.middleware.json :refer [wrap-json-body wrap-json-response]]

   [export-service-clojure.routes.export-routes
    :refer [export-routes]])
  (:gen-class))


(defroutes app-routes

  export-routes

  (GET "/health" []
    {:status 200
     :body {:message "Export microservice works"}})

  (route/not-found
   {:status 404
    :body {:error "Route not found"}}))


(def app
  (-> app-routes
      wrap-json-response
      (wrap-json-body {:keywords? true})))


(defn -main
  []

  (let [port
        (Integer/parseInt
         (or (System/getenv "PORT")
             "5001"))]

    (println
     (str "Export microservice running on port " port))

    (run-jetty app
               {:port port
                :join? false})))