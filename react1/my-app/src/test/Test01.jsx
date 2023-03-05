import React, { useState } from 'react';

function MyTest01(props) {
  let [count, setCount] = useState(0);

  return (
    <div>
      <p>총 {count}번 클릭했습니다.</p>
      <button onClick={() => setCount(count + 1)}>클릭</button>
    </div>
  );
}

export default MyTest01;
