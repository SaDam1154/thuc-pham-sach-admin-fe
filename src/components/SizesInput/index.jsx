import clsx from 'clsx';
import range from '../../utils/range';

export default function SizesInput({
    initSizes = range(30, 50),
    disabledSizes = [],
    selectedSizes = [],
    onSelectedSizeChange,
}) {
    function checkDisabledSize(size) {
        return disabledSizes.includes(size);
    }

    function checkSelectedSize(size) {
        return selectedSizes.includes(size);
    }

    function handleSelectSize(s) {
        const _selectedSize = [...selectedSizes];
        const index = _selectedSize.findIndex((_s) => _s == s);
        if (index !== -1) {
            _selectedSize.splice(index, 1);
        } else {
            _selectedSize.push(s);
        }

        onSelectedSizeChange && onSelectedSizeChange(_selectedSize);
    }

    return (
        <div className="flex flex-wrap">
            {initSizes.map((s, i) => (
                <div
                    key={i}
                    className={clsx(
                        'mr-2 mb-2 cursor-pointer rounded border px-3 py-2 hover:border-blue-500',
                        {
                            '!border-blue-600 bg-blue-600 text-white': checkSelectedSize(s),
                            'pointer-events-none bg-slate-300 opacity-50': checkDisabledSize(s),
                        }
                    )}
                    onClick={() => handleSelectSize(s)}
                >
                    {s}
                </div>
            ))}
        </div>
    );
}
