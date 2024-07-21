export default function rangeFilterFn(row, columnId, filterValue) {
    if (filterValue.max && Number(filterValue.max) < row.getValue(columnId)) return false;
    if (filterValue.min && Number(filterValue.min) > row.getValue(columnId)) return false;
    return true;
}
