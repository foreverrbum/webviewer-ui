import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import selectors from 'selectors';


const ToolbarPanel = () => {
  const [
    signers,
  ] = useSelector(
    state => [
      selectors.getSigners(state),
    ],
    shallowEqual,
  );
  console.log(signers)
  return(
    <div>Hello this is the ToolbarPanel</div>
  );
}
export default ToolbarPanel;