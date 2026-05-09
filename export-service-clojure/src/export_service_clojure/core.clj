(ns export-service-clojure.core
  (:require
   [ring.adapter.jetty :refer [run-jetty]]
   [compojure.core :refer [GET defroutes]]
   [compojure.route :as route]
   [ring.middleware.json :refer [wrap-json-body wrap-json-response]]

   ;; Export routes
   [export-service-clojure.routes.export-routes
    :refer [export-routes]])
  (:gen-class))



(defroutes app-routes

  ;; Export endpoints
  export-routes

  ;; Health check
  (GET "/health" []
    {:status 200
     :body {:message "Export microservice works"}})

  ;; 404
  (route/not-found
   {:status 404
    :body {:error "Route not found"}}))



(def app
  (-> app-routes
      wrap-json-response
      (wrap-json-body {:keywords? true})))


(defn -main
  []

  (println "Export microservice running on port 5001")

  (run-jetty app
             {:port 5001
              :join? false}))