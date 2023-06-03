function getList(items, rows_per_page, page){
    page--
    let loop_start = rows_per_page * page
    let pagination = items.slice(loop_start, loop_start + rows_per_page)
    console.log(pagination)
    return pagination
}

module.exports = getList