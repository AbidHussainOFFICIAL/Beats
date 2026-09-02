import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32.001" height="32" fill="currentColor" {...props}>
      <path d="M16.014 0a16 16 0 0 0-4.8.737v8.861a8 8 0 1 1-3.2 6.4V2.136a16 16 0 1 0 8-2.136Zm.2 11.2a4.8 4.8 0 1 0 4.7 4.9 4.8 4.8 0 0 0-4.7-4.9Z" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2ZM2 16V2h6v14H2Zm14 0h-6V9h6v7Zm0-9h-6V2h6v5Z"
        fill="#fff"
      />
    </svg>
  );
}

export function ShopArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
      />
    </svg>
  );
}

export function BagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="22" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.977 8.84A2 2 0 0 1 3.971 7H16.03a2 2 0 0 1 1.994 1.84l.803 10A2 2 0 0 1 16.833 21H3.167a2 2 0 0 1-1.993-2.16l.803-10v0Z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 10V5a4 4 0 1 0-8 0v5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="23" height="23" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M11.5 21.917c5.753 0 10.416-4.664 10.416-10.417S17.253 1.083 11.5 1.083 1.083 5.747 1.083 11.5 5.747 21.917 11.5 21.917Z" strokeWidth={2.083} />
      <path d="M11.5 6.292v6.25m0 3.646v.52" strokeWidth={2.083} strokeLinecap="round" />
    </svg>
  );
}

export function SubscribeArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="18" height="16" fill="none" stroke="#ffffff" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.434 8H3L1.518 2.101a.496.496 0 0 1-.018-.105c-.016-.54.58-.915 1.095-.668L16.5 8 2.595 14.672c-.51.245-1.098-.12-1.095-.65a.495.495 0 0 1 .025-.14l1.1-3.632"
        strokeWidth={2.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CartSmallIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="18" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.983 7.38A1.5 1.5 0 0 1 3.479 6h9.043a1.5 1.5 0 0 1 1.495 1.38l.603 7.5a1.501 1.501 0 0 1-1.495 1.62H2.875a1.5 1.5 0 0 1-1.494-1.62l.602-7.5v0Z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 8.25V4.5a3 3 0 0 0-6 0v3.75" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="10" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1.333 8.5 8 1.833 14.666 8.5" strokeWidth={2.083} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="10" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m8.723 9 .445-2.896H6.389V4.225c0-.792.388-1.564 1.633-1.564h1.263V.196S8.139 0 7.043 0C4.755 0 3.259 1.387 3.259 3.898v2.207H.716V9h2.543v7h3.13V9h2.334Z" />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15.762 2.291a6.218 6.218 0 0 1-1.783.489 3.113 3.113 0 0 0 1.365-1.719 6.2 6.2 0 0 1-1.972.754A3.107 3.107 0 0 0 8.08 4.648 8.82 8.82 0 0 1 1.68 1.403a3.104 3.104 0 0 0-.053 3.027c.24.45.59.835 1.014 1.12a3.098 3.098 0 0 1-1.406-.39v.04a3.107 3.107 0 0 0 2.491 3.046 3.128 3.128 0 0 1-1.403.053 3.107 3.107 0 0 0 2.902 2.156 6.232 6.232 0 0 1-4.599 1.287 8.783 8.783 0 0 0 4.76 1.395c5.713 0 8.837-4.732 8.837-8.836 0-.133-.004-.268-.01-.401a6.312 6.312 0 0 0 1.549-1.607l.001-.002Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.977.71C5.759.676 6.008.668 8 .668c1.992 0 2.242.008 3.023.044.781.035 1.315.16 1.781.34.489.185.932.474 1.299.847.373.366.661.809.845 1.298.182.467.306 1 .342 1.78.036.783.044 1.033.044 3.024 0 1.992-.009 2.241-.044 3.023-.036.78-.16 1.314-.342 1.78-.184.49-.472.933-.845 1.3-.367.373-.81.661-1.299.845-.466.181-1 .305-1.78.341-.782.036-1.032.044-3.024.044s-2.241-.008-3.023-.044c-.78-.035-1.313-.16-1.78-.34a3.597 3.597 0 0 1-1.3-.846 3.595 3.595 0 0 1-.845-1.299c-.181-.467-.305-1-.341-1.78C.675 10.241.667 9.991.667 8c0-1.992.009-2.241.044-3.023.035-.78.16-1.314.34-1.78.185-.49.474-.933.847-1.3a3.595 3.595 0 0 1 1.298-.846c.467-.18 1-.304 1.78-.34h.001Zm5.987 1.32C10.19 1.996 9.958 1.989 8 1.989s-2.19.007-2.963.043c-.715.032-1.103.152-1.362.252a2.277 2.277 0 0 0-.843.548c-.244.237-.43.525-.548.844-.101.258-.22.646-.253 1.362-.035.773-.043 1.005-.043 2.963 0 1.958.008 2.19.043 2.963.033.716.152 1.104.253 1.362.117.318.304.607.548.844.236.243.525.43.843.548.259.1.647.22 1.362.252.773.036 1.005.043 2.963.043 1.959 0 2.19-.007 2.964-.043.715-.032 1.103-.152 1.362-.252.342-.134.586-.292.843-.548.243-.237.43-.526.548-.844.1-.258.22-.646.253-1.362.035-.773.042-1.005.042-2.963 0-1.958-.007-2.19-.042-2.963-.033-.716-.152-1.104-.253-1.362a2.276 2.276 0 0 0-.548-.844 2.276 2.276 0 0 0-.843-.548c-.259-.1-.647-.22-1.362-.252Zm-3.9 8.23a2.446 2.446 0 1 0 1.76-4.563 2.447 2.447 0 0 0-1.76 4.564ZM5.335 5.336a3.77 3.77 0 1 1 5.33 5.33 3.77 3.77 0 0 1-5.33-5.33Zm7.27-.543a.893.893 0 0 0-.276-1.474.891.891 0 1 0 .277 1.474Z"
      />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.667 1.892A1.225 1.225 0 0 1 1.892.667h12.215a1.225 1.225 0 0 1 1.227 1.225v12.215a1.227 1.227 0 0 1-1.226 1.226H1.892a1.226 1.226 0 0 1-1.225-1.226V1.892ZM6.472 6.26h1.986v.997c.287-.573 1.02-1.09 2.122-1.09 2.113 0 2.614 1.143 2.614 3.238v3.881h-2.138V9.881c0-1.193-.287-1.866-1.015-1.866-1.01 0-1.43.726-1.43 1.866v3.404H6.472V6.26Zm-3.666 6.935h2.138V6.167H2.806v7.027Zm2.444-9.32a1.376 1.376 0 1 1-2.75.061 1.376 1.376 0 0 1 2.75-.06Z"
      />
    </svg>
  );
}

export function ConnectionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="15" height="23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m1.208 6.292 12.5 10.416-6.25 5.209V1.083l6.25 5.209-12.5 10.416" stroke="#F8F8F8" strokeWidth={2.083} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BatteryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="23" height="15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.75 1.25H3.166c-1.15 0-2.083.933-2.083 2.083v8.334c0 1.15.933 2.083 2.083 2.083H17.75c1.15 0 2.083-.933 2.083-2.083V3.333c0-1.15-.933-2.083-2.083-2.083Z"
        stroke="#F8F8F8"
        strokeWidth={2.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.875 4.375 8.375 7.5h4.167l-2.5 3.125m9.791-5.208h1.563a.52.52 0 0 1 .52.52v3.125a.52.52 0 0 1-.52.521h-1.563V5.417Z"
        stroke="#F8F8F8"
        strokeWidth={2.083}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LoadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="13" height="23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.188 5.25h-.782V.562H8.844V5.25H4.156V.562H2.594V5.25h-.781A1.562 1.562 0 0 0 .25 6.813V11.5a6.255 6.255 0 0 0 5.469 6.195v4.742H7.28v-4.742A6.256 6.256 0 0 0 12.75 11.5V6.812a1.563 1.563 0 0 0-1.563-1.562Zm0 6.25a4.688 4.688 0 0 1-9.376 0V6.812h9.376V11.5Z"
        fill="#F8F8F8"
      />
    </svg>
  );
}

export function MicrophoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="17" height="25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1.469 10.156a.781.781 0 0 1 .781.781V12.5a6.25 6.25 0 0 0 12.5 0v-1.563a.781.781 0 1 1 1.563 0V12.5a7.812 7.812 0 0 1-7.032 7.773v3.165h4.688a.781.781 0 1 1 0 1.562H3.03a.781.781 0 1 1 0-1.563H7.72v-3.164A7.812 7.812 0 0 1 .687 12.5v-1.563a.781.781 0 0 1 .782-.78Z"
        fill="#F8F8F8"
      />
      <path
        d="M11.625 12.5a3.125 3.125 0 1 1-6.25 0V4.687a3.125 3.125 0 0 1 6.25 0V12.5ZM8.5 0a4.687 4.687 0 0 0-4.688 4.688V12.5a4.688 4.688 0 0 0 9.376 0V4.687A4.688 4.688 0 0 0 8.5 0Z"
        fill="#F8F8F8"
      />
    </svg>
  );
}
