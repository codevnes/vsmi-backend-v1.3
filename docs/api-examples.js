// Ví dụ về cách gọi API tin tức bằng JavaScript

// 1. Lấy danh sách tin tức
async function getNewsList(page = 1, limit = 10, sourceWebsite = null) {
  let url = `http://your-api-domain.com/api/news?page=${page}&limit=${limit}`;
  
  if (sourceWebsite) {
    url += `&sourceWebsite=${encodeURIComponent(sourceWebsite)}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Danh sách tin tức:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin tức:', error);
  }
}

// 2. Lấy chi tiết tin tức theo ID
async function getNewsById(newsId) {
  const url = `http://your-api-domain.com/api/news/${newsId}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Chi tiết tin tức:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tin tức:', error);
  }
}

// 3. Lấy danh sách các nguồn tin
async function getNewsSources() {
  const url = 'http://your-api-domain.com/api/news/sources';
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Danh sách nguồn tin:', data);
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nguồn tin:', error);
  }
}

// 4. Ví dụ sử dụng với async/await
async function example() {
  // Lấy tin tức trang 1, 10 bài viết mỗi trang
  const newsPage1 = await getNewsList(1, 10);
  
  // Lấy tin tức từ nguồn cafef.vn
  const cafefNews = await getNewsList(1, 10, 'cafef.vn');
  
  // Nếu có dữ liệu, lấy chi tiết tin đầu tiên
  if (newsPage1 && newsPage1.data && newsPage1.data.length > 0) {
    const firstNewsId = newsPage1.data[0].id;
    const newsDetail = await getNewsById(firstNewsId);
    
    // Hiển thị nội dung tổng hợp
    if (newsDetail) {
      console.log('Tiêu đề:', newsDetail.title);
      console.log('Nội dung tổng hợp:', newsDetail.summarizedContent);
    }
  }
  
  // Lấy danh sách nguồn tin
  const sources = await getNewsSources();
}

// 5. Ví dụ sử dụng với axios
/*
import axios from 'axios';

async function getNewsWithAxios() {
  try {
    const response = await axios.get('http://your-api-domain.com/api/news', {
      params: {
        page: 1,
        limit: 10,
        sourceWebsite: 'cafef.vn'
      }
    });
    
    console.log('Danh sách tin tức:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tin tức:', error);
  }
}
*/

// Gọi hàm ví dụ
// example(); 