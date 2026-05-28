import { VoltraAndroid } from "voltra";
import { Proverb } from "../models/proverb";

export interface ProverbWidgetProps {
  proverb: Proverb | null;
}

export const ProverbWidget = ({ proverb }: ProverbWidgetProps) => (
  <VoltraAndroid.Box
    deepLinkUrl="lemuel://"
    style={{
      padding: 16,
      backgroundColor: "#E6F4FE",
      borderRadius: 16,
      width: "100%",
      height: "100%",
      justifyContent: "center",
    }}
  >
    {proverb ? (
      <VoltraAndroid.Column
        verticalAlignment="center-vertically"
        horizontalAlignment="center-horizontally"
      >
        <VoltraAndroid.Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333333",
            fontFamily: "nunito_400regular",
          }}
        >
          Daily Proverb
        </VoltraAndroid.Text>
        <VoltraAndroid.Text
          style={{
            fontSize: 18,
            color: "#1a1a1a",
            textAlign: "center",
            marginTop: 8,
            fontFamily: "nunito_400regular_italic",
          }}
        >
          {proverb.proverb}
        </VoltraAndroid.Text>
        <VoltraAndroid.Text
          style={{
            fontSize: 12,
            color: "#666666",
            marginTop: 8,
            fontFamily: "nunito_400regular",
          }}
        >
          {proverb.ref}
        </VoltraAndroid.Text>
      </VoltraAndroid.Column>
    ) : (
      <VoltraAndroid.Column
        verticalAlignment="center-vertically"
        horizontalAlignment="center-horizontally"
      >
        <VoltraAndroid.Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            color: "#333333",
            textAlign: "center",
            fontFamily: "nunito_400regular",
          }}
        >
          Please open the Lemuel app once to activate the widget.
        </VoltraAndroid.Text>
      </VoltraAndroid.Column>
    )}
  </VoltraAndroid.Box>
);
