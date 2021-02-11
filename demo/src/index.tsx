import React, { useState } from "react";
import ReactDOM from "react-dom";
import { RgbaColor } from "../../src";
import { DevTools } from "./components/DevTools";
import { useFaviconColor } from "./hooks/useFaviconColor";
import { useBodyBackground } from "./hooks/useBodyBackground";
import { useStargazerCount } from "./hooks/useStargazerCount";
import {
  GlobalStyles,
  Header,
  HeaderContent,
  HeaderDemo,
  HeaderDemoPicker,
  HeaderDescription,
  HeaderTitle,
  Link,
  LinkStarIcon,
  Links,
  LinkSeparator,
} from "./styles";

// See http://www.w3.org/TR/AERT#color-contrast
const getBrightness = ({ r, g, b }: RgbaColor) => (r * 299 + g * 587 + b * 114) / 1000;

const getRandomColor = (): RgbaColor => {
  const colors = [
    { r: 209, g: 97, b: 28, a: 1 }, // orange
    { r: 34, g: 91, b: 161, a: 1 }, // blue
    { r: 225, g: 17, b: 135, a: 0.7625 }, // purple
    { r: 21, g: 139, b: 59, a: 1 }, // green
    { r: 189, g: 60, b: 60, a: 1 }, // salmon
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

const Demo = () => {
  const [color, setColor] = useState<RgbaColor>(getRandomColor);
  const textColor = getBrightness(color) > 128 || color.a < 0.5 ? "#000" : "#FFF";

  const stargazerCount = useStargazerCount();

  const handleChange = (color: RgbaColor) => {
    console.log("🎨", color);
    setColor(color);
  };

  const colorString = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a}`;

  useBodyBackground(colorString);
  useFaviconColor(colorString);

  return (
    <div>
      <GlobalStyles />

      <Header style={{ color: textColor }}>
        <HeaderDemo>
          <HeaderDemoPicker color={color} onChange={handleChange} />
        </HeaderDemo>
        <HeaderContent>
          <HeaderTitle>React Colorful 🎨</HeaderTitle>
          <HeaderDescription>
            A tiny color picker component for React and Preact apps
          </HeaderDescription>

          <Links>
            <Link
              href="https://github.com/omgovich/react-colorful"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
              <LinkSeparator />
              <LinkStarIcon />
              {stargazerCount}
            </Link>
            <Link
              href="https://www.npmjs.com/package/react-colorful"
              target="_blank"
              rel="noreferrer"
            >
              NPM
            </Link>
          </Links>
        </HeaderContent>
      </Header>

      {process.env.NODE_ENV === "development" && <DevTools />}
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById("root"));
