import "@aws-amplify/auth";

import { Amplify } from "aws-amplify";
import amplifyconfig from "../amplify_outputs.json";

Amplify.configure(amplifyconfig);
