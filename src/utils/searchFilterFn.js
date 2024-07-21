import removeVietnameseTones from './removeVietnameseTones';

export default function searchFilterFn(row, columnId, filterValue) {
    if (!filterValue || filterValue === '') {
        return true;
    }
    if (
        removeVietnameseTones(row.getValue(columnId).toLowerCase()).includes(
            removeVietnameseTones(filterValue.toLowerCase())
        )
    ) {
        return true;
    }
    return false;
}
