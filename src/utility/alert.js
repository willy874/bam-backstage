import Swal from 'sweetalert2'

Swal.delete = (count = 0, options = {}) => {
  return Swal.fire({
    title: count > 1 ? `是否要刪除已選擇的${count}筆資料?` : '是否要刪除該筆資料?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff0000',
    cancelButtonColor: '#999',
    confirmButtonText: '刪除',
    cancelButtonText: '取消',
    ...options
  })
}

Swal.checkConfirm = (options = {}) => {
  return Swal.fire({
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff0000',
    cancelButtonColor: '#999',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    ...options
  })
}

Swal.success = (options = {}) => {
  if (typeof options === 'string') {
    return Swal.fire({
      icon: 'success',
      title: options
    })
  }
  return Swal.fire({
    icon: 'success',
    title: '發送成功',
    ...options
  })
}

Swal.error = (options = {}) => {
  if (typeof options === 'string') {
    return Swal.fire({
      icon: 'error',
      title: options
    })
  }
  return Swal.fire({
    icon: 'error',
    title: '系統錯誤，請聯繫開發人員',
    ...options
  })
}

export default Swal