package chat;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public class ChatThread implements Runnable {

	public static List<ChatThread> clientList = new ArrayList<>();
	public Socket socket;
	private BufferedReader buffReader;
	private BufferedWriter buffWriter;
	private String name;

	public ChatThread() {
	}

	public ChatThread(Socket socket) {
		try {
			this.socket = socket;
			this.buffWriter = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
			this.buffReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
			this.name = buffReader.readLine();
			clientList.add(this);
			spreadMessage("[" + name + "]" + "님이 입장하셨습니다.");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}

	@Override
	public void run() {
		while (socket.isConnected()) {
			try {
				String receiveMessage = buffReader.readLine();
				if (receiveMessage == null) {
					break;
				}
				spreadMessage(receiveMessage);
			} catch (IOException ioe) {
				ioe.printStackTrace();
				break;
			}
		}
		closeAll();
	}

	public void spreadMessage(String messages) {
		for (ChatThread chatThread : clientList) {
			try {
				if (!chatThread.name.equals(name)) {
					chatThread.buffWriter.write(messages);
					chatThread.buffWriter.newLine();
					chatThread.buffWriter.flush();
					System.out.println("DEBUG: Message sent to " + chatThread.name);
				}
			} catch (IOException ioe) {
				ioe.printStackTrace();
				continue;
			}
		}
	}

	public void removeClient() {
		if (socket != null && socket.isClosed()) {
			clientList.remove(this);
			spreadMessage("[" + name + "]" + "님이 퇴장하셨습니다.");
		}
	}

	public void closeAll() {
		removeClient();
		try {
			if (buffWriter != null) {
				buffWriter.close();
			}
			if (buffReader != null) {
				buffReader.close();
			}
			if (socket != null && !socket.isClosed()) {
				socket.close();
			}
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}

} // End of class