# Trước khi bắt đầu
1. Để thống nhất coding style cho nhóm, hãy cài ESLint trên VSCode Extension
2. Nếu cảm thấy 1 luật nào đó ko thích hợp, hãy thay đổi nội dung file **.eslintrc.json**
3. Kiểm tra các dependency đã được cài local hết chưa 
```bash
$ npm list --depth=0
```
4. Cập nhật các thư viện mà bản thân có sử dụng thêm vào trang [Wiki](https://github.com/kim-ninh/TH16-News/wiki/C%C3%A1c-framework,-library,-tool-c%E1%BA%A7n-thi%E1%BA%BFt) để nhóm tiện theo dõi
5. Nhiệt tình làm việc với nhóm :))
6. Nên chạy ứng dụng dưới chế độ DEBUG, để hiện thông tin các request từ browser
```bash
DEBUG=th16-news:* npm start         #trên Git-Bash
set DEBUG=th16-news:* & npm start   #trên CMD
```

# Các task đặc biệt:

1. ~~Cài đặt MySQL version 8 trở lên~~
2. Phân quyền nhóm người dùng *Guest/subscriber/writer/editor/admin*
3. Convert html -> file PDF (subscriber tải về)
4. Truy vấn đệ quy (Các chuyên mục)
5. Phân trang các bài viết (phân trên server)

   Mục đích tối ưu hệ thống, không được `SELECT * FROM TALBE` mà mỗi lần lấy chỉ lấy một phần nhỏ (tự quy định số lượng).
   Sẽ có 2 hướng: chia trang tải trang mới và không tải lại trang
 
   Tải trang mới: thêm vào đuôi đường dẫn hiện tại query string **&page=n** và nhận xử lý ở router bình thường..
   Không tải trang: nghiên cứu dùng AJAX để gửi request lên server và nhận dữ liệu từ Server về, thêm dữ liệu đã nhận từ javascript client


6. Kỹ thuật tìm kiếm *Full-text search*
7. Các vấn đề liên quan mật khẩu tài khoản: `bcrypt`, email OTP
8. Đăng nhập qua tài khoản *The-Logic-News*, *FB*, *Google+*, *Github* <http://www.passportjs.org/>
9. Viết API cho việc truy xuất DB thuận lợi hơn *(Lớp View sẽ gọi API lớp Model, lớp model sẽ gọi API DB, do đó sẽ có 2 bộ API)*
10. Thiết kế các trang báo lỗi (ít nhất là 2): **404**, **500**, 403, 401. (Không cần đẹp xuất sắc nhưng phải có, gọi `next()` để request chuyển tiếp tới các router error khi có lỗi )

# Các task cơ bản

## Thao tác chung:
1. routing (Controller)
2. lấy dữ liệu từ DB (Model)
3. render template trả cho browser (View)


STT | Đường dẫn router xử lý | Nội dung
---: | --- | ---
1 | / | Trang chủ
2 | /category/ten-chuyen-muc | Danh sách chuyên mục
3 | /tags/ten-nhan | Danh sách nhãn
4 | /ten-bai-viet | Chi tiết bài viết
5 | /search&keyword= | Từ khóa tìm kiếm
6 | /writer/articles/add | Đăng bài viết
7 | /writer/articles | Danh sách các bài viết
8 | /writer/article/edit | Hiệu chỉnh bài viết
9 | /editor/drafts | Danh sách draft của pv do mình quản lý
10 | /admin/cateories | Quản lý chuyên mục
11 | /admin/tags |  Quản lý nhãn
12 | /admin/articles | Quản lý bài viết
13 | /admin/users | Quản lý người dùng
14 | /account/subscriber | 
15 | /account/writer |
16 | /account/editor |
17 | /account/admin | 
18 | /forgot-pass | Quên mật khẩu
