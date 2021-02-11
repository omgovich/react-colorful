import { createElement } from "react";
import { styled, setup } from "goober";
import { createGlobalStyles } from "goober/global";
import { Star } from "./components/Icon";
import { RgbaColorPicker } from "../../src";

setup(createElement);

export const GlobalStyles = createGlobalStyles`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: none;
    font: inherit;
    outline: none;
  }

  body {
    color: #222;
    background-color: #fff;
    font: normal 20px/1.4 "Recursive", Arial, Helvetica, sans-serif;
  }
`;

export const Header = styled("header")`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  min-height: 100vh;
  padding: 120px 32px;
  transition: color 0.15s;
  color: #fff;

  @media (max-width: 767px) {
    max-width: 360px;
    padding: 40px 20px;
    flex-direction: column;
  }
`;

export const HeaderDemo = styled("div")`
  position: relative;
  width: 200px;
  flex-shrink: 0;
`;

export const HeaderDemoPicker = styled(RgbaColorPicker)`
  width: 100%;
  border-radius: 9px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
`;

export const HeaderContent = styled("div")`
  flex-grow: 1;
  margin-left: 40px;

  @media (max-width: 767px) {
    text-align: center;
    margin-top: 40px;
    margin-left: 0;
  }
`;

export const HeaderTitle = styled("h1")`
  margin-bottom: 16px;
  font-size: 44px;
  line-height: 1;

  @media (max-width: 767px) {
    font-size: 32px;
  }
`;

export const HeaderDescription = styled("h2")`
  max-width: 16em;

  @media (max-width: 767px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

export const Links = styled("nav")`
  display: flex;
  margin-top: 32px;
`;

export const Link = styled("a")`
  display: flex;
  align-items: center;
  height: 44px;
  margin-right: 16px;
  color: inherit;
  text-decoration: none;
  border: 2px solid currentColor;
  border-radius: 6px;
  padding: 0 16px;
  opacity: 0.8;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    opacity: 1;
  }
`;

export const LinkStarIcon = styled(Star)`
  margin-right: 4px;
`;

export const LinkSeparator = styled("span")`
  width: 2px;
  height: 100%;
  margin: 0 12px;
  background: currentColor;
`;

export const PreviewContainer = styled("div")`
  display: flex;
  align-items: center;
  padding: 60px;
  background-color: #fff;
  border-top: 1px solid #aaa;
`;

export const PreviewTitle = styled("div")`
  flex-shrink: 0;
  width: 7em;
  text-align: right;
  padding-right: 20px;
`;

export const PreviewDemo = styled("div")`
  flex-shrink: 0;
`;

export const PreviewOutput = styled("div")`
  font-family: "PT Mono", monospace;
  margin-left: 20px;
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
`;
