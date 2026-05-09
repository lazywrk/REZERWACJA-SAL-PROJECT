(ns export-service-clojure.routes.export-routes
  (:require
   [compojure.core :refer [POST defroutes]]
   [clojure.data.csv :as csv]
   [clojure.java.io :as io]
   [clj-pdf.core :refer [pdf]]))



(defn generate-csv [bookings]

  (with-out-str
    (csv/write-csv
     *out*

     (cons
      ["id"
       "user_email"
       "room_name"
       "start_time"
       "end_time"
       "status"]

      (map
       (fn [b]
         [(str (:id b))
          (:user_email b)
          (:room_name b)
          (str (:start_time b))
          (str (:end_time b))
          (:status b)])

       bookings)))))


(defn generate-pdf [bookings]

  (let [file-path "bookings-report.pdf"]

    (pdf
     (concat

      [{:title "Raport rezerwacji"}

       [:heading "Raport rezerwacji"]

       [:spacer 10]]

      (mapv
       (fn [b]

         [:paragraph
          (str
           "ID: " (:id b)
           "\n"
           "User: " (:user_email b)
           "\n"
           "Room: " (:room_name b)
           "\n"
           "Start: " (:start_time b)
           "\n"
           "End: " (:end_time b)
           "\n"
           "Status: " (:status b)
           "\n")])

       bookings))

     file-path)

    file-path))



(defroutes export-routes

  ;; CSV EXPORT
  (POST "/export/csv" req

    (let [bookings (get-in req [:body :bookings])

          csv-data (generate-csv bookings)]

      {:status 200

       :headers
       {"Content-Type" "text/csv"
        "Content-Disposition"
        "attachment; filename=bookings.csv"}

       :body csv-data}))

  ;; PDF EXPORT
  (POST "/export/pdf" req

    (let [bookings (get-in req [:body :bookings])

          pdf-path (generate-pdf bookings)]

      {:status 200

       :headers
       {"Content-Type" "application/pdf"
        "Content-Disposition"
        "attachment; filename=bookings.pdf"}

       :body (io/input-stream pdf-path)})))