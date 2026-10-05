import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { Button, Modal, Pressable, Text, View } from 'react-native';

// A 10-second test card with a seconds counter, bundled so that nothing depends on the network.
const source = require('./assets/clip.mp4');

export default function App() {
  const player = useVideoPlayer(source);
  const [open, setOpen] = useState(false);
  const [presses, setPresses] = useState(0);
  const [heard, setHeard] = useState({ start: 0, move: 0, end: 0 });
  const count = (kind: keyof typeof heard) => setHeard((now) => ({ ...now, [kind]: now[kind] + 1 }));

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Button title="Open" onPress={() => setOpen(true)} />
      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 24 }}>
          <View onTouchStart={() => count('start')} onTouchMove={() => count('move')} onTouchEnd={() => count('end')}>
            <VideoView player={player} nativeControls style={{ height: 300 }} />
          </View>
          <Pressable onPress={() => setPresses((n) => n + 1)} style={{ padding: 16, backgroundColor: '#ddd' }}>
            <Text>Pressed {presses} time(s)</Text>
          </Pressable>
          <Text>
            Touches on the player, as JS heard them: {heard.start} start, {heard.move} move, {heard.end} end
          </Text>
        </View>
      </Modal>
    </View>
  );
}
