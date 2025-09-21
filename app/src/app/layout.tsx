import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}


// .active::before {
//   content: '';
//   position: absolute;
//   left: 0;
//   top: 50%;
//   width: 30px;
//   height: 10px;
//   border-radius: 0 12px 12px 0;
//   background: #29b0ff;
//   box-shadow: 0 0 12px 4px #1cacffb7;
//   z-index: 1;
//   animation: slideBarInLeft 0.4s forwards;
//   transition: transform 0.4s;
//   transform: translate(0, -50%);
// }

// .item:not(.active)::before {
//   content: '';
//   position: absolute;
//   left: 0;
//   top: 50%;
//   width: 30px;
//   height: 10px;
//   border-radius: 0 12px 12px 0;
//   background: #29b0ff;
//   box-shadow: 0 0 12px 4px #1cacffb7;
//   z-index: 1;
//   animation: slideBarOutLeft 0.4s forwards;
//   transition: transform 0.4s;
//   transform: translate(-100%, -50%);
//   pointer-events: none;
//   opacity: 0;
// }

// @keyframes slideBarOutLeft {
//   from {
//     opacity: 1;
//     transform: translate(0, -50%);
//   }
//   to {
//     opacity: 0;
//     transform: translate(-100%, -50%);
//   }
// }
// @keyframes slideBarInLeft {
//     from {
//         transform: translate(-100%, -50%);
//         opacity: 0.5;
//     }
//     to {
//         transform: translate(0, -50%);
//         opacity: 1;
//     }
// }
// .active::before {
//   transform: translateY(-50%) scaleX(1);
// }

// @keyframes slideBarIn {
//   from { transform: translateY(-50%) scaleX(0); opacity: 0.5; }
//   to { transform: translateY(-50%) scaleX(1); opacity: 1; }
// }