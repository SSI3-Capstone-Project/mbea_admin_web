import axios from '../Auth/axios' // ✅ axios instance ที่แนบ token ให้อัตโนมัติอยู่แล้ว

export async function getExchangeReports() {
  try {
    const response = await axios.get('/api/operator/exchange-reports')
    console.log(response);
    return {
      success: true,
      data: response.data.data, // ✅ array ของ exchange reports
      message: response.data.message
    }
  } catch (error) {
    console.error('❌ Failed to get reports:', error)
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Something went wrong'
    }
  }
}

export async function getExchangeReportDetail(id) {
    try {
      const res = await axios.get(`/api/operator/exchange-reports/${id}`)
      return {
        success: true,
        data: res.data.data,
        message: res.data.message
      }
    } catch (err) {
      return {
        success: false,
        data: null,
        message: err.response?.data?.message || 'Failed to load report detail'
      }
    }
  }

  export async function markExchangeReportResolved(id) {
    try {
      const res = await axios.patch(`/api/operator/exchange-reports/${id}`, {
        status: 'resolved'
      })
      return {
        success: true,
        message: res.data.message
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to mark as resolved'
      }
    }
  }
