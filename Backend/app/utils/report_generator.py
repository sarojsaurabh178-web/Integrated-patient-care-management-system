import csv
import io
from datetime import datetime

def generate_csv_report(data: list, fields: list) -> str:
    output = io.StringIO()
    writer = csv.writer(output)

    # Header
    headers = [f["label"] for f in fields]
    writer.writerow(headers)

    # Rows
    for row in data:
        row_vals = []
        for f in fields:
            val = getattr(row, f["key"], None) if hasattr(row, f["key"]) else row.get(f["key"], "")
            row_vals.append(str(val) if val is not None else "")
        writer.writerow(row_vals)

    return output.getvalue()

def generate_html_report(title: str, summary_items: list, table_headers: list, table_rows: list) -> str:
    summary_html = "".join([
        f"""
        <div class="card">
            <h4>{item['label']}</h4>
            <div class="value">{item['value']}</div>
        </div>
        """ for item in summary_items
    ])

    headers_html = "".join([f"<th>{h}</th>" for h in table_headers])
    rows_html = "".join([
        f"<tr>{''.join([f'<td>{cell}</td>' for cell in row])}</tr>" for row in table_rows
    ])

    return f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{title}</title>
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #1e293b; background: #f8fafc; }}
        .header {{ text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }}
        .header h1 {{ color: #1e3a8a; margin: 0; font-size: 28px; }}
        .header p {{ color: #64748b; margin: 5px 0 0; }}
        .summary-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }}
        .card {{ background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }}
        .card h4 {{ margin: 0 0 5px; color: #64748b; font-size: 13px; text-transform: uppercase; }}
        .card .value {{ font-size: 22px; font-weight: bold; color: #2563eb; }}
        table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }}
        th {{ background: #1e3a8a; color: white; text-align: left; padding: 12px 16px; font-size: 14px; }}
        td {{ padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
        tr:nth-child(even) {{ background: #f8fafc; }}
        .footer {{ margin-top: 40px; text-align: center; color: #94a3b8; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🏥 MEDITRACK HEALTHCARE SYSTEM (PYTHON & POSTGRESQL ENGINE)</h1>
        <p>{title} | Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
    </div>

    <div class="summary-grid">
        {summary_html}
    </div>

    <table>
        <thead>
            <tr>{headers_html}</tr>
        </thead>
        <tbody>
            {rows_html}
        </tbody>
    </table>

    <div class="footer">
        MediTrack Integrated Patient Care Management System &copy; 2026. Confidential Medical Document.
    </div>
</body>
</html>
    """
