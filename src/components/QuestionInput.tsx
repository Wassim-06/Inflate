interface QuestionInputProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  products?: { name: string; image: string }[];
}

const QuestionInput: React.FC<QuestionInputProps> = ({ type, value, onChange, products }) => {
  switch (type) {
    case 'yes/no':
      return (
        <div>
          <label>
            <input
              type="radio"
              value="yes"
              checked={value === 'yes'}
              onChange={() => onChange('yes')}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              value="no"
              checked={value === 'no'}
              onChange={() => onChange('no')}
            />
            No
          </label>
        </div>
      );
    case 'open':
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      );
    case 'rating':
      return (
        <div>
          {[...Array(10)].map((_, index) => (
            <label key={index}>
              <input
                type="radio"
                value={(index + 1).toString()}
                checked={value === (index + 1).toString()}
                onChange={() => onChange((index + 1).toString())}
              />
              {index + 1}
            </label>
          ))}
        </div>
      );
    case 'product-review':
      return (
        <div>
          {products?.map((product, index) => (
            <div key={index} className="mb-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 mb-2" />
              <p>{product.name}</p>
              <div>
                {[...Array(5)].map((_, starIndex) => (
                  <label key={starIndex}>
                    <input
                      type="radio"
                      value={(starIndex + 1).toString()}
                      checked={value === (starIndex + 1).toString()}
                      onChange={() => onChange((starIndex + 1).toString())}
                    />
                    {starIndex + 1} Star
                  </label>
                ))}
              </div>
              <textarea
                placeholder="Add your comment"
                className="border border-gray-300 rounded p-2 w-full mt-2"
              />
            </div>
          ))}
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Fill All Ratings</button>
        </div>
      );
    default:
      return <div>Unsupported question type</div>;
  }
};

export default QuestionInput;
