/**
 * GOOGLE APPS SCRIPT WEB APP - BACKEND KHẢO SÁT CHUYÊN GIA & NHÀ TUYỂN DỤNG
 * Ngành: Địa lý tự nhiên (Trình độ đại học) - Trường ĐH Tài nguyên & Môi trường Hà Nội
 * 
 * HƯỚNG DẪN TRIỂN KHAI TRONG 1 PHÚT:
 * 1. Mở một Google Sheet mới (ví dụ đặt tên: "Kết quả khảo sát Chuyên gia - Địa lý tự nhiên") tại https://sheets.new
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) > Apps Script
 * 3. Xóa code cũ, dán toàn bộ đoạn mã này vào.
 * 4. Bấm "Triển khai" (Deploy) > "Tùy chọn triển khai mới" (New deployment).
 * 5. Chọn loại: "Ứng dụng web" (Web App).
 *    - Mô tả: Backend Khao sat Chuyen gia Dia ly tu nhien
 *    - Người thực thi (Execute as): Tôi (Me)
 *    - Người có quyền truy cập (Who has access): Bất kỳ ai (Anyone)  <-- BẮT BUỘC CHỌN
 * 6. Bấm "Triển khai" (Deploy) > Cấp quyền truy cập cho tài khoản của bạn.
 * 7. Copy "URL ứng dụng web" (Web App URL) và dán vào biến GOOGLE_SCRIPT_WEB_APP_URL trong file khaosatchuyengia/index.html.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000); // Khóa đồng bộ dữ liệu
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    
    // Nếu sheet còn trống, tạo Header tự động với định dạng chuyên nghiệp
    if (sheet.getLastRow() === 0) {
      var headers = [
        'Thời gian gửi',
        // Thông tin cá nhân & công tác
        'Họ tên, học hàm/học vị', 'Độ tuổi', 'Giới tính', 'Chức vụ', 
        'Cơ quan công tác', 'Địa chỉ cơ quan', 'Số điện thoại', 'Email',
        'Trình độ chuyên môn cao nhất', 'Ngành', 'Nơi cấp bằng',
        'Kinh nghiệm: Quản lý', 'Kinh nghiệm: Nghiên cứu', 'Kinh nghiệm: Giáo dục', 'Kinh nghiệm: Tư vấn', 'Kinh nghiệm: Lĩnh vực khác',
        // Đánh giá ngành
        'Mức độ cần thiết hiện tại', 
        'Dự báo nhu cầu tuyển dụng', 'Lý do giải thích nhu cầu tuyển dụng',
        'Phù hợp sứ mạng & mục tiêu Trường',
        'Phù hợp quy hoạch KT-XH địa phương & cả nước',
        'Vị trí việc làm tại cơ quan có thể tiếp nhận',
        // 16 năng lực (Likert 1-5)
        '1. Sáng tạo trong CV', '2. Tư duy phản biện', '3. Ngoại ngữ', '4. CNTT',
        '5. Kỹ thuật số', '6. Tự chủ trong CV', '7. Đạo đức & trách nhiệm', '8. Giao tiếp',
        '9. Làm việc nhóm', '10. Vấn đề liên ngành', '11. Quản lý chất lượng CV', '12. Kỷ luật',
        '13. Cầu thị, học hỏi', '14. Phát triển bền vững', '15. Trách nhiệm cộng đồng', '16. Cam kết đồng hành',
        // Góp ý chuyên sâu
        'Yêu cầu đặc biệt đối với người học tốt nghiệp',
        'Lưu ý khi ứng tuyển vào cơ quan/doanh nghiệp'
      ];
      
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#065f46'); // Màu xanh lá học thuật sang trọng
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Đọc payload gửi từ form HTML
    var data = JSON.parse(e.postData.contents);
    
    var row = [
      new Date(),
      data.fullName || '',
      data.age || '',
      data.gender || '',
      data.position || '',
      data.organization || '',
      data.orgAddress || '',
      data.phone || '',
      data.email || '',
      data.highestDegree || '',
      data.major || '',
      data.institution || '',
      data.exp_ql || 'Không',
      data.exp_nc || 'Không',
      data.exp_gd || 'Không',
      data.exp_tv || 'Không',
      data.exp_khac ? (data.exp_khac_name ? data.exp_khac_name + ': ' + data.exp_khac : data.exp_khac) : 'Không',
      data.necessityLevel || '',
      data.recruitmentTrend || '',
      data.recruitmentExplain || '',
      data.suitabilityMission || '',
      data.suitabilityPlanning || '',
      data.jobPositions || '',
      // 16 năng lực
      data.cap_1 || '',
      data.cap_2 || '',
      data.cap_3 || '',
      data.cap_4 || '',
      data.cap_5 || '',
      data.cap_6 || '',
      data.cap_7 || '',
      data.cap_8 || '',
      data.cap_9 || '',
      data.cap_10 || '',
      data.cap_11 || '',
      data.cap_12 || '',
      data.cap_13 || '',
      data.cap_14 || '',
      data.cap_15 || '',
      data.cap_16 || '',
      // 2 câu hỏi định tính
      data.specialRequirements || '',
      data.recruitmentNotes || ''
    ];
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Ý kiến chuyên gia đã được lưu thành công!' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Backend Web App cho Khảo sát Chuyên gia ngành Địa lý tự nhiên đang hoạt động bình thường!");
}
