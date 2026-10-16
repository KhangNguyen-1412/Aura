import sys
import os
import json
import asyncio
import edge_tts

async def synthesize(text, output_file, voice='vi-VN-NamMinhNeural', max_retries=3):
    os.makedirs(os.path.dirname(os.path.abspath(output_file)), exist_ok=True)
    tmp_file = output_file + '.tmp'

    for attempt in range(1, max_retries + 1):
        try:
            # Sử dụng giọng NamMinhNeural chuẩn tự nhiên (Giọng Nam Trầm Ấm, Quyền Lực Tổng Tài)
            comm = edge_tts.Communicate(text, voice)
            await comm.save(tmp_file)
            if os.path.exists(tmp_file) and os.path.getsize(tmp_file) > 100:
                os.replace(tmp_file, output_file)
                return True
        except Exception as e:
            sys.stderr.write(f"TTS Attempt {attempt} failed: {e}\n")
            if attempt < max_retries:
                await asyncio.sleep(0.4 * attempt)
        finally:
            if os.path.exists(tmp_file):
                try:
                    os.remove(tmp_file)
                except Exception:
                    pass

    return False

def main():
    try:
        if len(sys.argv) > 1 and sys.argv[1] == '--json':
            raw = sys.stdin.buffer.read().decode('utf-8-sig', errors='replace')
            data = json.loads(raw)
            text = data.get('text', '')
            output = data.get('output', '')
            voice = data.get('voice', 'vi-VN-NamMinhNeural')
        else:
            cfg_path = sys.argv[1]
            with open(cfg_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            text = data.get('text', '')
            output = data.get('output', '')
            voice = data.get('voice', 'vi-VN-NamMinhNeural')

        if not text or not output:
            sys.stderr.write("Missing text or output parameter\n")
            sys.exit(1)

        success = asyncio.run(synthesize(text, output, voice))
        if success:
            sys.exit(0)
        else:
            sys.exit(1)
    except Exception as ex:
        sys.stderr.write(f"TTS Main Exception: {ex}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()
