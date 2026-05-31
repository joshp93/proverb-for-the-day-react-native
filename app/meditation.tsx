import { useMemo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import {
  Skia,
  Canvas,
  Fill,
  Shader,
  useCanvasSize,
  type Uniforms,
} from "@shopify/react-native-skia";

const DURATION_MS = 60000;

const sksl = `uniform float u_progress;
uniform vec2 u_resolution;

const float PI = 3.14159265;
const vec3 RING_COLOR = vec3(0.1, 0.2, 0.7);
const float INTENSITY = 0.008;
const float FADE_WIDTH = 0.06;

half4 main(vec2 xy) {
    vec2 uv = xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    uv = (uv - vec2(0.5)) * vec2(aspect, 1.0);

    float ringRadius = 0.35 * min(1.0, aspect);
    float arcEnd = 2.0 * PI * u_progress;

    float dist = length(uv);
    float distToRing = abs(dist - ringRadius);
    float radialGlow = 1.0 / (distToRing + 0.003);

    float pixelAngle = atan(-uv.y, uv.x);
    float clockwiseFromTop = PI / 2.0 - pixelAngle;
    if (clockwiseFromTop < 0.0) clockwiseFromTop += 2.0 * PI;

    float beginFade = max(arcEnd - FADE_WIDTH, 0.0);
    float angularMask = 1.0 - smoothstep(beginFade, arcEnd + 0.0001, clockwiseFromTop);
    angularMask = mix(angularMask, 1.0, step(1.0, u_progress));

    float distMask = 1.0 - smoothstep(0.01, 0.12, distToRing);

    vec3 color = RING_COLOR * radialGlow * angularMask * distMask * INTENSITY;
    return half4(color, 1.0);
}`;

export default function MeditationScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const { ref, size: canvasSize } = useCanvasSize();

  const effect = useMemo(() => Skia.RuntimeEffect.Make(sksl)!, []);

  useEffect(() => {
    const start = performance.now();
    let frameId: number;

    const tick = () => {
      const elapsed = performance.now() - start;
      setProgress(Math.min(elapsed / DURATION_MS, 1));
      if (elapsed < DURATION_MS) {
        frameId = requestAnimationFrame(tick);
      }
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  const uniforms: Uniforms = {
    u_progress: progress,
    u_resolution: [canvasSize.width, canvasSize.height],
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Meditation",
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
        }}
      />
      <Canvas style={{ flex: 1 }} ref={ref}>
        <Fill>
          <Shader source={effect} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
