import Swal from 'sweetalert2'

export default {
  Swal,
  delete: (count = 0) => {
    return Swal.fire({
      title: count > 1 ? `是否要刪除已選擇的${count}筆資料?` : '是否要刪除該筆資料?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonColor: '#999',
      confirmButtonText: '刪除',
      cancelButtonText: '取消',
    })
  },
}
