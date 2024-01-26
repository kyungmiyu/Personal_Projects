package chat;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;

import javax.swing.JOptionPane;
import javax.swing.SwingUtilities;

public class Client {
	private Socket socket;
	private BufferedReader buffReader;
	private BufferedWriter buffWriter;
	private String name;
	private ChatGUI chatGUI;

	public Client() {
	}

	public Client(String name) {
		try {
			this.name = name;
			this.socket = new Socket("localhost", 9999);
			this.buffWriter = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
			this.buffReader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}

	public void sendMessage(String message) {
		try {
			buffWriter.write("[" + name + "] " + message);
			//buffWriter.newLine();
			buffWriter.flush();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		}
	}

	public void readMessage() {
		new Thread(new Runnable() {
			@Override
			public void run() {
				while (socket.isConnected()) {
					try {
						String message = buffReader.readLine();
						if (message != null) {
							chatGUI.appendMessage(message);
						}
					} catch (IOException ioe) {
						ioe.printStackTrace();
					} 
				}
			}
		}).start();
	}

	public String getName() {
		return name;
	}

	public void setGUI(ChatGUI chatGUI) {
		this.chatGUI = chatGUI;
	}

	public static void main(String[] args) {
		String name = getNameFromUserInput(); // 이름 입력 받기
		Client client = new Client(name);
		client.readMessage();

		SwingUtilities.invokeLater(new Runnable() {
			public void run() {
				ChatGUI chatGUI = new ChatGUI(client, name); // 이름 전달
			}
		});
	}

	// 사용자로부터 이름 입력 받는 메서드
	private static String getNameFromUserInput() {
		String name = "";
		while (name.isEmpty()) {
			name = JOptionPane.showInputDialog("이름을 입력하세요 : ");
			if (name == null) {
				System.exit(0);
			}
		}
		return name;
	}

} // End of class