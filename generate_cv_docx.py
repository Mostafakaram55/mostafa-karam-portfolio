import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn, nsdecls
from docx.oxml import parse_xml

def add_hyperlink(paragraph, url, text, color="004B91", underline=True, font_name="Times New Roman", font_size=Pt(9.5)):
    """Add a clickable hyperlink to a paragraph in docx."""
    part = paragraph.part
    r_id = part.relate_to(url, docx.opc.constants.RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

    hyperlink = parse_xml(f'<w:hyperlink xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="{r_id}" />')
    
    new_run = OxmlElement('w:r')
    rPr = OxmlElement('w:rPr')
    
    if font_name:
        rFonts = parse_xml(f'<w:rFonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:ascii="{font_name}" w:hAnsi="{font_name}" />')
        rPr.append(rFonts)
    if font_size:
        sz = parse_xml(f'<w:sz xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="{int(font_size.pt * 2)}" />')
        rPr.append(sz)
    if color:
        c = parse_xml(f'<w:color xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="{color}" />')
        rPr.append(c)
    if underline:
        u = parse_xml('<w:u xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" w:val="single" />')
        rPr.append(u)
        
    new_run.append(rPr)
    new_run_text = parse_xml(f'<w:t xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xml:space="preserve">{text}</w:t>')
    new_run.append(new_run_text)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)
    return hyperlink

def add_section_header(doc, title):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.keep_with_next = True
    
    # Add bottom border
    pPr = p._p.get_or_add_pPr()
    pBdr = parse_xml('<w:pBdr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:bottom w:val="single" w:sz="6" w:space="2" w:color="333333"/></w:pBdr>')
    pPr.append(pBdr)
    
    run = p.add_run(title)
    run.font.name = "Times New Roman"
    run.font.size = Pt(11)
    run.bold = True
    run.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_entry_header(doc, title_company, date_str):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.keep_with_next = True
    
    # Setup tab stop on right side (width is ~7.5 inches with 0.5 in margins)
    pPr = p._p.get_or_add_pPr()
    tabs = parse_xml('<w:tabs xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:tab w:val="right" w:pos="10800"/></w:tabs>')
    pPr.append(tabs)
    
    r1 = p.add_run(title_company)
    r1.font.name = "Times New Roman"
    r1.font.size = Pt(10)
    r1.bold = True
    
    r_tab = p.add_run('\t')
    r_tab.font.name = "Times New Roman"
    
    r2 = p.add_run(date_str)
    r2.font.name = "Times New Roman"
    r2.font.size = Pt(9.5)
    r2.font.italic = True
    r2.font.color.rgb = RGBColor(80, 80, 80)
    return p

def add_bullet(doc, text):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1.5)
    p.paragraph_format.left_indent = Inches(0.25)
    
    run = p.add_run(text)
    run.font.name = "Times New Roman"
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(30, 30, 30)
    return p

def create_cv_docx(output_path):
    doc = docx.Document()
    
    # Page setup: Margins
    for section in doc.sections:
        section.top_margin = Inches(0.5)
        section.bottom_margin = Inches(0.5)
        section.left_margin = Inches(0.5)
        section.right_margin = Inches(0.5)
        section.header_distance = Inches(0.3)
        section.footer_distance = Inches(0.3)
        
    # --- HEADER ---
    p_name = doc.add_paragraph()
    p_name.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_name.paragraph_format.space_before = Pt(0)
    p_name.paragraph_format.space_after = Pt(2)
    r_name = p_name.add_run("Mostafa Karam Saeed")
    r_name.font.name = "Times New Roman"
    r_name.font.size = Pt(18)
    r_name.bold = True
    
    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(2)
    r_sub = p_sub.add_run("Flutter Developer · Mobile & Dashboard Applications · Clean Architecture")
    r_sub.font.name = "Times New Roman"
    r_sub.font.size = Pt(10)
    
    p_contact = doc.add_paragraph()
    p_contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_contact.paragraph_format.space_before = Pt(0)
    p_contact.paragraph_format.space_after = Pt(4)
    
    r_c1 = p_contact.add_run("Awsim, Giza, Egypt · +20 111 331 2766 · ")
    r_c1.font.name = "Times New Roman"
    r_c1.font.size = Pt(9.5)
    
    add_hyperlink(p_contact, "https://github.com/Mostafakaram55", "GitHub", color="004B91", font_name="Times New Roman", font_size=Pt(9.5))
    
    r_c2 = p_contact.add_run(" · ")
    r_c2.font.name = "Times New Roman"
    r_c2.font.size = Pt(9.5)
    
    add_hyperlink(p_contact, "https://www.linkedin.com/in/mostafa-karam-21abbb244", "LinkedIn", color="004B91", font_name="Times New Roman", font_size=Pt(9.5))
    
    r_c3 = p_contact.add_run(" · ")
    r_c3.font.name = "Times New Roman"
    r_c3.font.size = Pt(9.5)
    
    add_hyperlink(p_contact, "mailto:mostafakaram345678@gmail.com", "mostafakaram345678@gmail.com", color="004B91", font_name="Times New Roman", font_size=Pt(9.5))

    # --- SUMMARY ---
    add_section_header(doc, "SUMMARY")
    p_sum = doc.add_paragraph()
    p_sum.paragraph_format.space_before = Pt(2)
    p_sum.paragraph_format.space_after = Pt(4)
    r_sum = p_sum.add_run(
        "Flutter Developer with 2 years of professional experience at MDSoft, developing and maintaining production-ready mobile and dashboard applications. "
        "Experienced in building scalable Flutter applications using Dart, Clean Architecture, Bloc/Cubit, REST APIs, Firebase, and modern development practices. "
        "Contributed to 5 live production projects, including mobile applications published on Google Play and the Apple App Store, along with web-based dashboards. "
        "Also familiar with AI Automation and integrating automation concepts into modern software development workflows."
    )
    r_sum.font.name = "Times New Roman"
    r_sum.font.size = Pt(9.5)

    # --- EXPERIENCE ---
    add_section_header(doc, "EXPERIENCE")
    
    # 1. MDSoft
    add_entry_header(doc, "Flutter Developer · MDSoft", "2024 – Present")
    add_bullet(doc, "Developed and maintained multiple production-grade Flutter mobile applications published on Google Play and the Apple App Store.")
    add_bullet(doc, "Built and deployed KORLEN, a full-featured e-commerce app, along with 2 white-label clones: HTG and Veron, sharing a common codebase with customised branding and configuration.")
    add_bullet(doc, "Developed Tok Tok Taxi, a complete delivery and ride-hailing platform with live location tracking, an admin dashboard, and separate user, driver, and agent applications, including Bluetooth receipt printing and internal printing support.")
    add_bullet(doc, "Developed Gb Ghadir, a full-featured e-commerce app integrated with WhatsApp chat and a custom WebSocket-based live chat for real-time technical support.")
    add_bullet(doc, "Developed VA Note, a patient management and appointment scheduling app with Firebase Firestore, FCM reminders, and MVVM Clean Architecture.")
    add_bullet(doc, "Developed Vitamin, a restaurant order management app with a customer ordering app and an admin dashboard for managing orders, categories, and sub-products, integrated with a third-party delivery service and the QCard payment gateway.")
    add_bullet(doc, "Configured CI/CD pipelines using GitHub Actions for automated APK/AAB builds and deployments.")

    # 2. Orange Digital Center
    add_entry_header(doc, "Flutter Intern · Orange Digital Center", "2022 · 3 months")
    add_bullet(doc, "Completed intensive hands-on Flutter and Dart training covering widgets, navigation, and responsive UI design.")
    add_bullet(doc, "Built mobile app screens with reusable widgets and clean, maintainable project structure.")
    add_bullet(doc, "Consumed REST APIs and managed app state using Bloc/Cubit.")
    add_bullet(doc, "Practised Git-based workflows and delivered a practical Flutter project at the end of the program.")

    # 3. Instant Software Solutions
    add_entry_header(doc, "Flutter Intern · Instant Software Solutions", "2022 · 3 months")
    add_bullet(doc, "Developed Flutter application features and UI screens from design specifications.")
    add_bullet(doc, "Integrated REST APIs and handled loading, error, and empty states across screens.")
    add_bullet(doc, "Applied Bloc/Cubit state management and organised code with Clean Architecture principles.")
    add_bullet(doc, "Worked with Firebase services and collaborated with the team using Git.")
    add_bullet(doc, "Received a Certificate of Appreciation for completing the 3-month Flutter Developer training.")

    # 4. MASA for Training & Consulting
    add_entry_header(doc, "Training Courses · MASA for Training & Consulting", "Jul – Sep 2022")
    add_bullet(doc, "Flutter — practical course, 16 Jul – 1 Sep 2022, 30 practical training hours (certificate of completion).")
    add_bullet(doc, "Advanced Flutter — practical course, 21 Aug – 18 Sep 2022, 30 practical training hours (certificate of completion).")
    add_bullet(doc, "Networks — practical course, 16 Jul – 1 Sep 2022, 30 practical training hours (certificate of completion).")

    # 5. 4G Academy
    add_entry_header(doc, "Arduino Course (Project Maker) · 4G Academy", "Feb 2021")
    add_bullet(doc, "Completed a hands-on Arduino course on building electronics and microcontroller projects; certificate issued 25 Feb 2021 with grade Excellent.")

    # 6. TSA
    add_entry_header(doc, "Python & AI with Android Mobile Application · TSA", "Oct – Nov 2020")
    add_bullet(doc, "Completed an online course held in Cairo (1 Oct – 15 Nov 2020) by Progress and Knowledge for Educational Services (TSA); certificate issued 20 Nov 2020.")

    # --- PROJECTS ---
    add_section_header(doc, "PROJECTS")
    
    # 1. KORLEN
    p_k = doc.add_paragraph()
    p_k.paragraph_format.space_before = Pt(4)
    p_k.paragraph_format.space_after = Pt(1)
    p_k.paragraph_format.keep_with_next = True
    r_k = p_k.add_run("KORLEN — E-Commerce App (with HTG & Veron clones)")
    r_k.font.name = "Times New Roman"
    r_k.font.size = Pt(10)
    r_k.bold = True
    
    p_k_links = doc.add_paragraph()
    p_k_links.paragraph_format.space_before = Pt(0)
    p_k_links.paragraph_format.space_after = Pt(2)
    p_k_links.paragraph_format.keep_with_next = True
    add_hyperlink(p_k_links, "https://play.google.com/store/apps/details?id=com.mdsoft.korlen&hl=en", "Play Store")
    r_sep = p_k_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_k_links, "https://apps.apple.com/eg/app/%D9%83%D9%88%D8%B1%D9%84%D9%86/id6758906505", "App Store")
    r_sep = p_k_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_k_links, "https://korlen-test.md-soft.app/", "Admin Dashboard")
    
    add_bullet(doc, "Developed a full-featured e-commerce app for online retail, including product catalog, cart, and secure checkout.")
    add_bullet(doc, "Built 2 white-label clones of the app — HTG and Veron — reusing the core codebase with custom branding and store configuration.")
    add_bullet(doc, "Implemented real-time order updates and push notifications via Firebase Cloud Messaging.")

    # 2. Tok Tok Taxi
    p_t = doc.add_paragraph()
    p_t.paragraph_format.space_before = Pt(4)
    p_t.paragraph_format.space_after = Pt(1)
    p_t.paragraph_format.keep_with_next = True
    r_t = p_t.add_run("Tok Tok Taxi — Delivery & Ride-Hailing Platform")
    r_t.font.name = "Times New Roman"
    r_t.font.size = Pt(10)
    r_t.bold = True
    
    p_t_links = doc.add_paragraph()
    p_t_links.paragraph_format.space_before = Pt(0)
    p_t_links.paragraph_format.space_after = Pt(2)
    p_t_links.paragraph_format.keep_with_next = True
    add_hyperlink(p_t_links, "https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_user&hl=ar", "User App")
    r_sep = p_t_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_t_links, "https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_drivers", "Driver App")
    r_sep = p_t_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_t_links, "https://play.google.com/store/apps/details?id=com.mdsoft.tok_tok_taxi_agent", "Agent App")
    r_sep = p_t_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_t_links, "https://new-toktok-test.md-soft.app/", "Dashboard")

    add_bullet(doc, "Built a complete delivery and ride-hailing ecosystem with live trip tracking via Google Maps.")
    add_bullet(doc, "Developed separate apps for the customer, driver, and agent, plus an admin dashboard to manage operations.")
    add_bullet(doc, "Implemented Bluetooth-based receipt printing and internal printing workflows for order fulfilment.")

    # 3. Gb Ghadir
    p_g = doc.add_paragraph()
    p_g.paragraph_format.space_before = Pt(4)
    p_g.paragraph_format.space_after = Pt(1)
    p_g.paragraph_format.keep_with_next = True
    r_g = p_g.add_run("Gb Ghadir — E-Commerce App with Live Chat Support")
    r_g.font.name = "Times New Roman"
    r_g.font.size = Pt(10)
    r_g.bold = True
    
    p_g_links = doc.add_paragraph()
    p_g_links.paragraph_format.space_before = Pt(0)
    p_g_links.paragraph_format.space_after = Pt(2)
    p_g_links.paragraph_format.keep_with_next = True
    add_hyperlink(p_g_links, "https://play.google.com/store/apps/details?id=com.mdsoft.gbghadir&hl=en", "Play Store")
    
    add_bullet(doc, "Developed a full e-commerce app covering catalog browsing, cart, and checkout.")
    add_bullet(doc, "Integrated real-time technical support via a WhatsApp chat integration and a custom in-app live chat built with WebSockets.")

    # 4. VA Note
    p_v = doc.add_paragraph()
    p_v.paragraph_format.space_before = Pt(4)
    p_v.paragraph_format.space_after = Pt(1)
    p_v.paragraph_format.keep_with_next = True
    r_v = p_v.add_run("VA Note — Patient Management & Appointment App")
    r_v.font.name = "Times New Roman"
    r_v.font.size = Pt(10)
    r_v.bold = True
    
    p_v_links = doc.add_paragraph()
    p_v_links.paragraph_format.space_before = Pt(0)
    p_v_links.paragraph_format.space_after = Pt(2)
    p_v_links.paragraph_format.keep_with_next = True
    add_hyperlink(p_v_links, "https://play.google.com/store/apps/details?id=com.mdsoft.vanotesclinic", "Play Store")
    r_sep = p_v_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_v_links, "https://www.va-note.com/clinic/", "Dashboard")
    
    add_bullet(doc, "Developed a patient management and appointment app for clinics with organised scheduling and visit tracking.")
    add_bullet(doc, "Stored patient basic info, health details, and per-visit doctor notes in Firebase Firestore.")
    add_bullet(doc, "Enabled FCM push notifications to remind patients of upcoming appointments.")
    add_bullet(doc, "Managed app state with Bloc/Cubit under MVVM & Clean Architecture.")

    # 5. Vitamin
    p_m = doc.add_paragraph()
    p_m.paragraph_format.space_before = Pt(4)
    p_m.paragraph_format.space_after = Pt(1)
    p_m.paragraph_format.keep_with_next = True
    r_m = p_m.add_run("Vitamin — Restaurant Order Management App")
    r_m.font.name = "Times New Roman"
    r_m.font.size = Pt(10)
    r_m.bold = True
    
    p_m_links = doc.add_paragraph()
    p_m_links.paragraph_format.space_before = Pt(0)
    p_m_links.paragraph_format.space_after = Pt(2)
    p_m_links.paragraph_format.keep_with_next = True
    add_hyperlink(p_m_links, "https://play.google.com/store/apps/details?id=com.mdSoft.vitamin&pcampaignid=web_share", "Play Store")
    r_sep = p_m_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_m_links, "https://apps.apple.com/us/app/vitamin/id6802745158?l=ar", "App Store")
    r_sep = p_m_links.add_run(" | ")
    r_sep.font.name = "Times New Roman"
    r_sep.font.size = Pt(9.5)
    add_hyperlink(p_m_links, "https://vitamin.md-iraqsoft.com/", "Admin Dashboard")

    add_bullet(doc, "Built the customer-facing app for browsing the menu and placing restaurant orders.")
    add_bullet(doc, "Developed the admin dashboard for managing orders, categories, products, and sub-products.")
    add_bullet(doc, "Integrated with a third-party delivery service (Speedo) to hand off confirmed orders for fulfilment.")
    add_bullet(doc, "Integrated the QCard payment gateway to support in-app payments.")

    # --- SKILLS ---
    add_section_header(doc, "SKILLS")
    
    skills = [
        ("Programming Languages: ", "Dart, C#, Python, C++"),
        ("Mobile Development: ", "Flutter, RESTful APIs, WebSockets, Google Maps SDK"),
        ("Backend & Cloud Services: ", "Firebase (Authentication, Firestore, Cloud Messaging)"),
        ("State Management: ", "Bloc, Cubit, Provider"),
        ("Architecture & Design Patterns: ", "Clean Architecture, MVVM, Repository Pattern, Dependency Injection (GetIt, Injectable)"),
        ("Automation: ", "AI Automation, integrating automation workflows into modern software development"),
        ("DevOps & Automation: ", "CI/CD Pipelines, GitHub Actions, Version Automation, Build Configuration (Gradle, Info.plist)"),
        ("Embedded & Networking: ", "Arduino, Networks fundamentals"),
        ("Development Tools: ", "VS Code, Android Studio, Git, Firebase Console, Postman")
    ]
    
    for label, val in skills:
        p_sk = doc.add_paragraph()
        p_sk.paragraph_format.space_before = Pt(1)
        p_sk.paragraph_format.space_after = Pt(1)
        r_l = p_sk.add_run(label)
        r_l.font.name = "Times New Roman"
        r_l.font.size = Pt(9.5)
        r_l.bold = True
        
        r_v = p_sk.add_run(val)
        r_v.font.name = "Times New Roman"
        r_v.font.size = Pt(9.5)

    # --- EDUCATION ---
    add_section_header(doc, "EDUCATION")
    add_entry_header(doc, "Bachelor's Degree · Tiba Academy for Science and Technology", "Graduated 2023")

    doc.save(output_path)
    print(f"Generated successfully at: {output_path}")

if __name__ == "__main__":
    out = "d:/mostafa_karam_projects/mostafa-karam-portfolio/assets/cv/mostafa_karam_saeed_cv.docx"
    create_cv_docx(out)
