package chat;

import java.awt.BorderLayout;
import java.awt.Container;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;

public class ChatGUI extends JFrame {

	private JTextArea textArea;
	private JTextField textField;
	private JButton button;
	private JScrollPane scroll;
	private JTextField tooltipTextfield;
	private JLabel tooltipLabel;
	private JButton tooltipButton;
	private String nickName;
	private Client client;

	ChatGUI(Client client, String name) {
		this.client = client;
		this.nickName = name;
		client.setGUI(this);
		init();
	}

	void init() {
		this.setTitle("Chatting");
		this.setBounds(400, 400, 400, 400);

		textArea = new JTextArea();
		textArea.setEditable(false);

		scroll = new JScrollPane(textArea);
		scroll.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);

		textField = new JTextField();

		button = new JButton("보내기");
		button.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				if (!textField.getText().trim().isEmpty()) {
					enterButton();
				}
			}
		});

		textField.addKeyListener(new KeyAdapter() {
			@Override
			public void keyPressed(KeyEvent e) {
				if (e.getKeyCode() == KeyEvent.VK_ENTER) {
					if (!textField.getText().trim().isEmpty()) {
						enterButton();
					}
				}
			}
		});

		tooltipLabel = new JLabel("닉네임");
		tooltipButton = new JButton("설정");
		tooltipTextfield = new JTextField(10);

		tooltipButton.addActionListener(new ActionListener() {
			@Override
			public void actionPerformed(ActionEvent e) {
				String setnickName = tooltipTextfield.getText();
				if (setnickName != null && !setnickName.isEmpty()) {
					nickName = setnickName;
					tooltipTextfield.setText(setnickName);
					textArea.append("[" + nickName + "]" + "으로 변경되었습니다." + "\n");
				} else {
					JOptionPane.showMessageDialog(null, "닉네임을 입력하세요.");
				}
			}
		});

		JPanel tooltipPanel = new JPanel();
		tooltipPanel.add(tooltipLabel);
		tooltipPanel.add(tooltipTextfield);
		tooltipPanel.add(tooltipButton);

		JPanel panel1 = new JPanel();
		panel1.setLayout(new BorderLayout());
		panel1.add("Center", textField);
		panel1.add("East", button);

		Container c = getContentPane();
		c.add("Center", scroll);
		c.add("South", panel1);
		c.add("North", tooltipPanel);

		setDefaultCloseOperation(DISPOSE_ON_CLOSE);
		setVisible(true);
	}

	public void enterButton() {
		String message = textField.getText() + "\n";
		System.out.println(message.length());
		textArea.append("[" + nickName + "] :" + message);
		client.sendMessage(message);
		textField.setText("");
	}

	public void appendMessage(String message) {
		textArea.append(message + "\n");
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

	public static String getNameFromUserInput() {
		String name = "";
		while (name.isEmpty()) {
			name = JOptionPane.showInputDialog("이름을 입력하세요 : ");
			if (name == null) {
				System.exit(0);
			}
		}
		return name;
	}

}