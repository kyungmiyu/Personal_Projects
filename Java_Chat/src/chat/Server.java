package chat;

import java.io.IOException;
import java.net.ServerSocket;

public class Server {

	private ServerSocket serverSocket;
	
	public Server() {
	}
	
	public Server(ServerSocket serverSocket) {
		this.serverSocket = serverSocket;
	}
	
	public void startServer() {
		try {
			System.out.println("서버가 시작되었습니다.");
			while(!serverSocket.isClosed()) {
				new Thread(new ChatThread(serverSocket.accept())).start();
				System.out.println("[클라이언트 접속]");
			}
		} catch(IOException ioe) {
			ioe.printStackTrace();
		}
	}
	
	public void stopServer() {
		try {
			if(serverSocket != null) {
				serverSocket.close();
			}
		} catch(IOException ioe) {
			ioe.printStackTrace();
		}
	}
	
	public static void main(String[] args) throws Exception {
		new Server(new ServerSocket(9999)).startServer();
	}
	
} // End of class