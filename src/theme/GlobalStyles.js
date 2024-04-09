import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
body {
  margin: 0;
  font-family: ${({ theme }) => theme.font} !important;
}
.header-main-nav{
  background:${({ theme }) => theme?.colors?.header} !important;
}
.BodyApp{
  background:${({ theme }) => theme?.colors?.body} !important;

}
.BodyColor{
  background:${({ theme }) => theme?.colors?.body} !important;

}
.secondaryColor{
  color:${({ theme }) => theme?.colors?.secondaryColor} !important;
}
.primaryColor{
  color:${({ theme }) => theme?.colors?.primaryColor} !important;
}
.header-title-span, .headerFontColor{
  color:${({ theme }) => theme?.colors?.headerFontColor} !important;
}
.primaryButtonColor{
  color:${({ theme }) => theme?.colors?.primaryButton?.text} !important;
  background:${({ theme }) => theme?.colors?.primaryButton?.background} !important;
  border-color:${({ theme }) => theme?.colors?.primaryButton?.borderColor} !important;
  border-width:${({ theme }) => theme?.colors?.primaryButton?.borderSize} !important;
}
.secondaryButtonColor{
  color:${({ theme }) => theme?.colors?.secondaryButton?.text} !important;
  background:${({ theme }) => theme?.colors?.secondaryButton?.background} !important;
  border-color:${({ theme }) => theme?.colors?.secondaryButton?.borderColor} !important;
  border-width:${({ theme }) => theme?.colors?.secondaryButton?.borderSize} !important;
}
.iconSvgFillColor{
  fill:${({ theme }) => theme?.colors?.icon?.iconFillColor} !important;
}
.iconSvgStrokeColor{
  stroke:${({ theme }) => theme?.colors?.icon?.iconStrokeColor} !important;
}
.iconFillhover:hover{
  fill:${({ theme }) => theme?.colors?.icon?.iconHoverColor} !important;
}
.iconStrokehover:hover{
  stroke:${({ theme }) => theme?.colors?.icon?.iconHoverColor} !important;
}
`;
