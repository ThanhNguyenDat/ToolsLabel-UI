# Matrix

Nếu có 2 nhãn GOOD (Positive) và BAD (Negative) 

Suy ra:
  TP (true positive): Nhan GOOD va predict GOOD
  FN (false negative): Nhan GOOD va predict BAD
  FP (false positive): Nhan BAD va predict GOOD
  TN (true negative): Nhan BAD va predict BAD

# Accuracy

Tổng số dự báo đúng trên tổng số sample là bao nhiêu?

`accuracy = (TP + FP) / total_sample`

# Precision

Trong các trường hợp được dự báo là positive thì có bao nhiêu trường hợp là đúng ?

Precision càng cao thì mô hình càng tốt trong việc phân loại nhóm positive.

`precision = TP / (total_predicted_positive) = TP / (TP + FP)`

Improve:
- 
- 

# Recall

Tỷ lệ dự báo chính xác các trường hợp positive trên toàn bộ các mẫu thuộc nhóm positive.

`recall = TP / (total_actual_positive) = TP / (TP + FN)`

# Trade-off giữa precision và recall

Nếu chúng ta muốn khi mô hình dự báo 1 dataset test là GOOD (positive) thật chắc chắn nên lựa chọn một ngưỡng threshold cao hơn, chẳng hạn như 0.9.

