import handleViewport, { type InjectedViewportProps } from 'react-in-viewport';

const Block = (props: InjectedViewportProps<HTMLDivElement>) => {
  const { inViewport, forwardedRef } = props;
//   const color = inViewport ? '#217ac0' : '#ff9800';
//   const text = inViewport ? 'In viewport' : 'Not in viewport';
  return (
    <>
        <div className="viewport-block mt-5" ref={forwardedRef}>
        {/* <h3>{ text }</h3>
        <div style={{ width: '400px', height: '300px', background: color }} /> */}
        </div>
    </>
  );
};

const ViewportBlock = handleViewport(Block, /** options: {}, config: {} **/);

export default ViewportBlock;