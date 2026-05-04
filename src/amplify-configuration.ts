import { Amplify } from "@aws-amplify/core";

const awsExports = {
  Auth: {
    Cognito: {
      userPoolId: "eu-west-2_iQM6jAUkv",
      userPoolClientId: "47im7unupup988ridcvlmcqpg8",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code" as const,
      userAttributes: {
        email: { required: true },
      },
    },
  },
};

export function configureAmplify() {
  Amplify.configure(awsExports);
}

export const isConfigured = () => !!awsExports.Auth.Cognito.userPoolId;
