import * as React from 'react';
import { SVGProps } from 'react';

function SvgErrorSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        stroke={props.stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-4.35-4.35M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8 8l6 6M14 8l-6 6"
      />
    </svg>
  );
}

export default SvgErrorSearch;
