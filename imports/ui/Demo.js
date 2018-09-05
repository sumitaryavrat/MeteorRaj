// import React from 'react'
// import { EasyLoaderAgent, EasyList } from 'easify';
// import { Molecule } from 'react-molecule';
// // We have to pass a way to load the object to our easy loader, and that function needs to return a promise.
// const load = ({ filters, options }) =>
//   // The filters and options here can be from other agents
//   new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve([
//         {
//           _id: 'XXX',
//           name: 'John Smith',
//         },
//         {
//           _id: 'YYY',
//           name: 'John Brown',
//         },
//       ]);
//     }, 500);
//   });
 
// const MyList = () => (
//   <div><Molecule agents={{ loader: EasyLoaderAgent.factory({ load }) }}>
//     <EasyList>
//       {({ data, loading, molecule }) => {
//         return data.map(item => <Item item={item} key={item._id} />);
//       }}
//     </EasyList>
//   </Molecule></div>
// );
// export default MyList;