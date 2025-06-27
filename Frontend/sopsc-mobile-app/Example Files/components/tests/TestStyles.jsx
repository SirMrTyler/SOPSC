const testStyles = {};

testStyles.bodyStyle = {
  background:
    "linear-gradient(180deg, rgba(1, 14, 58, .5), rgba(1, 35, 58, .8))",
};

testStyles.navBarStyle = {
  display: "flex",
  flexWrap: "wrap",
  height: "45px",
  justifyContent: "center",
  position: "relative",
  overflow: "hidden",
  color: "white",
};
testStyles.navBarGradient = {
  justifyContent: "center",
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: "100%",
  background: "linear-gradient(to bottom, rgba(0, 204, 102, .9), transparent)",
};
testStyles.navBarContent = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  position: "relative",
};

testStyles.searchContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "5px",
  marginBottom: "10px",
};

testStyles.searchBoxLabelStyle = {
  marginRight: "20px",
  color: "white",
};

testStyles.searchBoxStyle = {
  marginRight: "30px",
  width: "59%",
  borderRadius: "7px",
  boxShadow: "0 4px 30px rgba(255, 255, 255, 0.25)",
};

testStyles.searchBtnStyle = {
  padding: "3.5px 15px",
  borderRadius: "25px",
};

testStyles.editBtnStyle = {
  marginTop: "10px",
  padding: "3.5px 2.5px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.25)",
};

testStyles.deleteBtnStyle = {
  marginTop: "10px",
  marginLeft: "5px",
  padding: "3.5px 2.5px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.25)",
};
testStyles.takeTestBtnStyle = {
  marginTop: "10px",
  marginLeft: "5px",
  padding: "3.5px 2.5px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.25)",
};

testStyles.testContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "25px",
  justifyContent: "center",
};

testStyles.cardStyle = {
  display: "flex",
  flexWrap: "wrap",
  whiteSpace: "pre-wrap",
  backgroundColor: "rgba(24, 246, 168, 0.6)",
  width: "30%",
  marginBottom: "20px",
  borderRradius: "16px",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.25)",
  backdropFilter: "blur(4.8px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
};

testStyles.cardTextStyle = {
  whiteSpace: "pre-wrap",
};

export default testStyles;
