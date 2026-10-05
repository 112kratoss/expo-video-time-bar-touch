# expo-video on Android: a touch on the time bar reaches JS as a start with no end

A minimal reproduction for an expo-video bug report.

It is `npx create-expo-app@latest --template blank-typescript` (Expo SDK 57, React Native 0.86.3) with `npx expo install expo-video` (57.0.5). `App.tsx` is the whole of it: a `VideoView` with `nativeControls` in a React Native `Modal`, a `Pressable` that counts its presses, and a line that says which touches on the player JS was told of. The clip is `assets/clip.mp4`, a 10-second test card generated with ffmpeg (`testsrc`), so nothing depends on the network.

## Run

```sh
npm install
npx expo run:android --variant release
```

## Steps

1. Press **OPEN**.
2. Drag the player's time bar. A press on the bar with no drag does the same.
3. Read the line under the button. It has gained one start, and no move and no end.
4. Press **Pressed 0 time(s)**.

**Expected:** the count goes to 1.

**Actual:** the first press does nothing. The second counts.

A drag across the picture, away from the time bar, does not do this: JS is told of its start, its moves and its end, and the press after it counts first time.

## Why

With `nativeControls`, `VideoView` reports touches to React Native from `onInterceptTouchEvent`. Media3's time bar calls `requestDisallowInterceptTouchEvent(true)` on its parents as a touch lands on it, `VideoView` records that like any `ViewGroup`, and Android stops calling the hook for the rest of the gesture. JS receives the touch start and never its end, so whichever view became the responder at the start (here the `Modal`'s host view) is never released and takes the next touch.
