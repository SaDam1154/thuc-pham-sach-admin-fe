export default function range(from, to) {
    return Array.from({ length: to - from + 1 }, (v, k) => k + from);
}
