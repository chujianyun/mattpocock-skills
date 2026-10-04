import SwiftUI
@main struct AcceptanceNotesApp: App {
 var body: some Scene { WindowGroup { ContentView() } }
}
struct ContentView: View {
 @State private var title = ""
 @AppStorage("savedTitle") private var savedTitle = ""
 var body: some View {
  VStack(spacing:20) {
   Text("Acceptance Notes").font(.title)
   TextField("Title",text:$title).accessibilityIdentifier("noteTitle")
   Button("Save") { savedTitle = title }.accessibilityIdentifier("saveNote")
   Text(savedTitle.isEmpty ? "No saved note" : savedTitle).accessibilityIdentifier("savedNote")
  }.padding(40)
 }
}
