import * as React from 'react';
import { SVGProps } from 'react';

function SvgErrorServer(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M4 6v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6M6 9h.01M10 9h.01M4 18h16M4 18a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2M4 18v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M6 20h.01M10 20h.01M14 15l3 3m0-3l-3 3"
      />
    </svg>
  );
}

export default SvgErrorServer;
