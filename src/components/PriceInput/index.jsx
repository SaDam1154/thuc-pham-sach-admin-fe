import clsx from 'clsx';
import PriceFormat from '../PriceFormat';

function PriceInput({
    id,
    placeholder,
    className,
    touched,
    error,
    value,
    name,
    onChange,
    onBlur,
    ...props
}) {
    return (
        <div className={clsx('relative', className)}>
            <input
                type="number"
                id={id}
                className="peer absolute w-full opacity-0"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                name={name}
                {...props}
            />
            <label
                htmlFor={id}
                className={clsx(
                    'text-input relative z-30 block w-full cursor-text py-[5px] peer-focus:border-blue-500',
                    {
                        invalid: error,
                        'text-gray-400': !value,
                    }
                )}
            >
                {value ? <PriceFormat>{value}</PriceFormat> : placeholder}
            </label>
            <label className="absolute top-0 right-0 py-1 pr-3 text-lg text-gray-600">VNĐ</label>
        </div>
    );
}

export default PriceInput;
