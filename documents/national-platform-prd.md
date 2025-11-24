## 1. Product Overview
A national-level data collection and management platform with three hierarchical roles (User, Admin, SuperAdmin) working with canvas-based tables. Users submit data through canvases, Admins aggregate and manage regional data, and SuperAdmin oversees national-level statistics with automated data flow between levels.

The platform enables efficient data collection across wilayas (regions) with real-time aggregation, role-based permissions, and comprehensive filtering capabilities for national decision-making.

## 2. Core Features

### 2.1 User Roles
| Role | Registration Method | Core Permissions |
|------|---------------------|------------------|
| CF (User) | Email registration | Create/edit own canvases, submit data, view personal statistics |
| DRB (Admin) | Admin assignment | Manage regional users, edit/delete user canvases, view regional statistics |
| DGB (SuperAdmin) | System assignment | Global oversight, manage admins, view all statistics, system configuration |

### 2.2 Feature Module
The platform requirements consist of the following main pages:
1. **Login page**: Email/password authentication with language selection
2. **Dashboard page**: Dynamic statistical charts filtered by user role level
3. **Template page**: Canvas CRUD operations with dual filtering system
4. **User Management page**: Role-specific user administration (Admin manages Users, SuperAdmin manages Admins)
5. **Reports page**: Canvas-specific report generation and submission
6. **Error page**: System error handling and user guidance

### 2.3 Page Details
| Page Name | Module Name | Feature description |
|-----------|-------------|---------------------|
| Login | Authentication | Email/password login, language toggle (Français/Arabic), role-based redirect |
| Dashboard | Statistics Charts | View role-appropriate charts, filter by time/region/data type, export capabilities |
| Template | Canvas Table | Create new canvas, edit existing data, submit for review, smart global filter, column-specific filters |
| Template | Data Validation | Real-time validation, error highlighting, auto-save functionality |
| User Management | User List | View users by role, search/filter users, add/edit/delete users, assign regions |
| User Management | Permissions | Configure user access levels, regional assignments, approval workflows |
| Reports | Report Generator | Create reports from canvas data, attach documents, submit to higher level |
| Reports | Report History | View submitted reports, track approval status, download past reports |
| Error | Error Display | Show appropriate error messages, provide navigation options, logging |
| Common | Header | Logo display, user profile dropdown, notification badge, language switcher |
| Common | Sidebar | Navigation menu with role-appropriate items, collapsible interface |

## 3. Core Process

### User Flow (CF)
User logs in → Access Template page → Create/edit canvas data → Apply filters for data organization → Submit canvas → Generate reports → View personal statistics

### Admin Flow (DRB)
Admin logs in → Overview of regional user canvases → Review individual user submissions → Edit/correct user data → Aggregate data into regional canvas → Generate regional reports → View regional statistics → Manage regional users

### SuperAdmin Flow (DGB)
SuperAdmin logs in → Global dashboard overview → Review admin-level aggregated data → Monitor national statistics → Manage admin users → Configure system settings → Access all regional data with filters

```mermaid
graph TD
  A[Login Page] --> B{Role Detection}
  B -->|CF (User)| C[Template Page]
  B -->|DRB (Admin)| D[User Management Page]
  B -->|DGB (SuperAdmin)| E[Dashboard Page]
  
  C --> F[Submit Canvas]
  F --> G[Reports Page]
  
  D --> H[Review User Canvas]
  H --> I[Regional Canvas]
  I --> J[Admin Reports]
  
  E --> K[Global Overview]
  K --> L[National Statistics]
  
  G --> M[Data Flow Upwards]
  J --> M
  M --> N[Auto-populate Higher Level]
  N --> K
```

## 4. User Interface Design

### 4.1 Design Style
- **Primary Colors**: Deep blue gradient (#1e40af to #3b82f6) for headers, emerald gradient (#10b981 to #34d399) for success states
- **Secondary Colors**: Neutral grays (#f3f4f6, #e5e7eb) for backgrounds, white for cards
- **Button Style**: Rounded corners (8px radius), subtle shadows, gradient backgrounds on primary actions
- **Typography**: Inter font family, 16px base size, responsive scaling
- **Layout**: Card-based design with consistent spacing (8px grid system)
- **Animations**: Smooth transitions (200-300ms), fade-in effects, loading skeletons
- **Icons**: Lucide React icons with consistent stroke width (2px)

### 4.2 Page Design Overview
| Page Name | Module Name | UI Elements |
|-----------|-------------|-------------|
| Login | Form | Centered card layout, gradient background, bilingual form labels, animated logo |
| Dashboard | Charts | Responsive grid layout, interactive charts with hover effects, filter dropdowns with animations |
| Template | Canvas Table | Expandable rows, inline editing, sticky headers, dual filter bars with search suggestions |
| User Management | User List | Data table with pagination, action buttons with icons, bulk operations dropdown |
| Reports | Report Form | Multi-step form with progress indicator, file upload drag-and-drop, rich text editor |
| Common | Header | Fixed position, gradient background, notification pulse animation, profile avatar dropdown |
| Common | Sidebar | Collapsible navigation, active state highlighting, icon + text layout, smooth transitions |

### 4.3 Responsiveness
- **Desktop-first approach** with mobile adaptation
- **Breakpoints**: 640px (mobile), 768px (tablet), 1024px (desktop)
- **Touch optimization** for tablet users in field data collection
- **Responsive tables** with horizontal scrolling on mobile
- **Collapsible sidebar** for smaller screens