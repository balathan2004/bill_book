export default function IndexPage() {
  return (
    <div className="home_container">
      <div className="margin_container">
      <section>
        <h2>📝 What is this?</h2>
        <p>
          This is a simple <strong>Expense Tracker App</strong> where you can
          manage your daily incomes & expenses. You can add, edit, delete, and
          view all your transactions in a clean dashboard.
        </p>
      </section>

      <section>
        <h2>🚀 Features</h2>
        <ul>
          <li>✅ Add income & expense entries manually</li>
          <li>✅ View all records in a responsive data grid</li>
          <li>✅ Import invoices via Excel (.xlsx)</li>
          <li>✅ Edit & Delete any record (CRUD)</li>
          <li>✅ Responsive for mobile & desktop</li>
        </ul>
      </section>

      <section>
        <h2>📊 How to Use</h2>
        <ol>
          <li>
            Go to <strong>Add Entry</strong> section to input income/expense
            manually.
          </li>
          <li>
            Use the <strong>Upload Invoice</strong> button to import multiple
            records via Excel.
          </li>
          <li>
            Check the <strong>Data Grid</strong> for all your entries.
          </li>
          <li>
            Click <strong>Edit</strong> or <strong>Delete</strong> to modify
            records.
          </li>
        </ol>
      </section>

      
      <section>
        <h2>🛠️ CRUD Operations</h2>
        <p>
          You can <strong>Create</strong>, <strong>Read</strong>,{" "}
          <strong>Update</strong>, and <strong>Delete</strong> any transaction.
          Just click the respective buttons in the Data Grid.
        </p>
      </section>

    

      <footer className="footer">
        <p>Made with ❤️ by [Your LightUzumaki]</p>
      </footer>
      </div>
    </div>
  );
}
