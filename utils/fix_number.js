export default function fix_number(x) {
    return Number.parseFloat(x).toFixed(2) || "0.00";
}