package com.example.demo.client.gui;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.net.URI;
import java.net.http.*;
import java.util.Vector;
import org.json.JSONArray;
import org.json.JSONObject;

public class ManagementSystemGUI extends JFrame {
    private final String BASE_URL = "http://localhost:8080/api";
    private final HttpClient client = HttpClient.newHttpClient();
    private JPanel cardPanel;
    private CardLayout cardLayout;

    public ManagementSystemGUI() {
        setTitle("Resort Admin Panel");
        setSize(1000, 700);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLocationRelativeTo(null); // center window

        // System.out.println("GUI starting...");

        cardLayout = new CardLayout();
        cardPanel = new JPanel(cardLayout);

        cardPanel.add(createLoginPanel(), "LOGIN");
        cardPanel.add(createDashboardPanel(), "DASHBOARD");

        add(cardPanel);
        setVisible(true);
    }

    private JPanel createLoginPanel() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBackground(new Color(248, 250, 252));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);

        JLabel title = new JLabel("Resort Management Login");
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        panel.add(title, gbc);

        gbc.gridwidth = 1;
        gbc.gridy = 1;
        panel.add(new JLabel("Email:"), gbc);
        JTextField emailField = new JTextField(20);
        gbc.gridx = 1;
        panel.add(emailField, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        panel.add(new JLabel("Password:"), gbc);
        JPasswordField passField = new JPasswordField(20);
        gbc.gridx = 1;
        panel.add(passField, gbc);

        JButton loginBtn = new JButton("Login");
        loginBtn.setPreferredSize(new Dimension(100, 35));
        loginBtn.setBackground(new Color(14, 165, 233));
        loginBtn.setForeground(Color.WHITE);
        loginBtn.setFocusPainted(false);
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.gridwidth = 2;
        panel.add(loginBtn, gbc);

        loginBtn.addActionListener(e -> {
            // just for testing so I don't need to type it every time
            // if (emailField.getText().equals("admin") &&
            // passField.getText().equals("123")) { ... }
            System.out.println("Login button clicked!");
            cardLayout.show(cardPanel, "DASHBOARD");
        });

        return panel;
    }

    private JPanel createDashboardPanel() {
        JPanel panel = new JPanel(new BorderLayout());

        // Sidebar
        JPanel sidebar = new JPanel();
        sidebar.setLayout(new BoxLayout(sidebar, BoxLayout.Y_AXIS));
        sidebar.setPreferredSize(new Dimension(200, 700));
        sidebar.setBackground(new Color(15, 23, 42));

        JLabel logoLabel = new JLabel("Ocean View");
        logoLabel.setForeground(Color.WHITE);
        logoLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        logoLabel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));
        sidebar.add(logoLabel);

        sidebar.add(createSidebarBtn("Rooms"));
        sidebar.add(createSidebarBtn("Reservations"));
        sidebar.add(createSidebarBtn("Transports"));
        sidebar.add(createSidebarBtn("Attractions"));

        panel.add(sidebar, BorderLayout.WEST);

        // Content Area
        JPanel content = new JPanel(new CardLayout());
        content.setBackground(Color.WHITE);

        // Rooms Table
        content.add(createTablePanel("rooms"), "Rooms");

        panel.add(content, BorderLayout.CENTER);
        return panel;
    }

    private JButton createSidebarBtn(String text) {
        JButton btn = new JButton(text);
        btn.setMaximumSize(new Dimension(200, 50));
        btn.setBackground(new Color(15, 23, 42));
        btn.setForeground(new Color(203, 213, 225));
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setAlignmentX(Component.LEFT_ALIGNMENT);
        return btn;
    }

    private JPanel createTablePanel(String type) {
        JPanel panel = new JPanel(new BorderLayout());
        String[] columns = { "ID", "Name/Number", "Details", "Status" };
        DefaultTableModel model = new DefaultTableModel(columns, 0);
        JTable table = new JTable(model);
        panel.add(new JScrollPane(table), BorderLayout.CENTER);

        JButton refreshBtn = new JButton("Refresh Data");
        refreshBtn.addActionListener(e -> refreshTableData(model, type));
        panel.add(refreshBtn, BorderLayout.SOUTH);

        return panel;
    }

    private void refreshTableData(DefaultTableModel model, String type) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BASE_URL + "/" + type))
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            JSONArray arr = new JSONArray(response.body());
            model.setRowCount(0);
            for (int i = 0; i < arr.length(); i++) {
                JSONObject obj = arr.getJSONObject(i);
                Vector<String> row = new Vector<>();
                row.add(obj.optString("id", "N/A"));
                row.add(obj.optString("roomNumber", obj.optString("name", "N/A")));
                row.add(obj.optString("roomType", obj.optString("location", "N/A")));
                row.add(obj.optString("status", "Active"));
                model.addRow(row);
            }
        } catch (Exception ex) {
            System.out.println("Error: " + ex.getMessage());
            // ex.printStackTrace();
            JOptionPane.showMessageDialog(this, "Can't load data right now!");
        }
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception e) {
        }
        new ManagementSystemGUI();
    }
}
