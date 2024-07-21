import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import clsx from 'clsx';

function ImageItem({ image, onDelete }) {
    const [src, setSrc] = useState(null);
    useEffect(() => {
        setSrc(image.type === 'live' ? image.url : URL.createObjectURL(image.file));
        return () => {
            image.type !== 'live' && URL.revokeObjectURL(src);
        };
    }, [image]);

    return (
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded border bg-gray-200">
            <img src={src} className="h-full w-full object-cover" />
            <div className="absolute top-0 left-0 right-0 flex justify-end space-x-2 p-2">
                {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-blue-500 hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                </div> */}
                <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-red-500 hover:bg-gray-100"
                    onClick={onDelete}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function ImagesInput({ images = [], onChange }) {
    function handleSelectImages(e) {
        if (e.target.files.length === 0) {
            return;
        }
        const newImages = [
            ...images,
            ...Array.from(e.target.files).map((f) => ({
                type: 'preview',
                file: f,
            })),
        ];
        e.target.value = null;
        onChange && onChange(newImages);
    }

    function handleDelete(index) {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange && onChange(newImages);
    }

    return (
        <div className="flex h-40 items-center">
            <input
                id="image-input"
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleSelectImages}
            />
            <div className="overflow-hidden">
                <Scrollbars
                    renderThumbHorizontal={() => (
                        <div className="h-2 rounded-full bg-gray-400 opacity-70"></div>
                    )}
                    autoHeight
                >
                    <div className="flex space-x-2">
                        {images.map((image, index) => (
                            <ImageItem
                                key={index}
                                image={image}
                                onDelete={() => handleDelete(index)}
                            />
                        ))}
                    </div>
                </Scrollbars>
            </div>

            <label
                htmlFor="image-input"
                className={clsx(
                    'ml-2 flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
                    {
                        '!ml-0 !h-40 !w-40 overflow-hidden rounded border': images.length === 0,
                    }
                )}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={clsx('h-6 w-6', {
                        '!h-10 !w-10': images.length === 0,
                    })}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </label>
        </div>
    );
}

export default ImagesInput;
