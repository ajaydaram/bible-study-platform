import { useState } from 'react';
import { BookOpen, ChevronRight, MapPin, Heart } from 'lucide-react';

type LessonId = 'intro' | 'lesson1' | 'lesson2' | 'lesson3' | 'application' | 'closing';

interface Lesson {
  id: LessonId;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  section: 'intro' | 'lesson' | 'application' | 'closing';
}

const lessons: Lesson[] = [
  { id: 'intro', title: 'What Is a Biblical Christian?', section: 'intro' },
  { id: 'lesson1', title: 'Where We Stand', subtitle: 'Personal Sin', section: 'lesson' },
  { id: 'lesson2', title: 'God\'s Solution', subtitle: 'The Divine Remedy for Sin', section: 'lesson' },
  { id: 'lesson3', title: 'Complying with God\'s Terms', subtitle: 'A Biblical Christian', section: 'lesson' },
  { id: 'application', title: 'Personal Application', section: 'application' },
  { id: 'closing', title: 'Closing', section: 'closing' },
];

export default function DiscipleshipStudy() {
  const [currentLesson, setCurrentLesson] = useState<LessonId>('intro');

  const renderIntroduction = () => (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Theme
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            A biblical Christian is not merely a religious person, a moral person, or someone raised around Christian ideas. A biblical Christian is someone who has been brought by God to see the truth about sin, to trust in Jesus Christ as the only Savior, and to live a changed life marked by repentance, faith, obedience, and love.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Main Goal
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            To help the reader:
          </p>
          <ul className="space-y-3">
            {[
              'Understand the difference between cultural Christianity and biblical Christianity',
              'See the seriousness of personal sin before a holy God',
              'Understand God\'s remedy for sin in the person and work of Jesus Christ',
              'Grasp the necessity of repentance and faith',
              'Examine the evidences of a truly converted life',
              'Respond personally, humbly, and honestly to the gospel'
            ].map((goal, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-primary-600 dark:text-primary-400 font-bold mt-1">✓</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Memory Verse
          </h2>
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-6 rounded-r-lg">
            <p className="text-lg italic text-gray-800 dark:text-gray-200 font-serif">
              "The time is fulfilled, and the kingdom of God is at hand; repent and believe in the gospel."
            </p>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-3">
              Mark 1:15
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The word "Christian" is often used loosely. Some use it to describe family background, political identity, church attendance, moral effort, or general respect for Jesus. But the Bible gives a much deeper and clearer definition.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            A biblical Christian is someone who has been united to Christ by faith, forgiven by His blood, born again by the Holy Spirit, and brought into a new life of repentance and obedience. Christianity is not merely adopting a label. It is receiving Christ Himself.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To understand what a biblical Christian is, we must begin where Scripture begins: with God, with sin, and with the gospel.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Key Passages
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Mark 1:14-15',
              'Romans 3:9-26',
              'Jeremiah 17:9',
              'Ezekiel 36:25-27',
              'John 3:1-8',
              '2 Corinthians 5:17-21',
              'Ephesians 2:1-10',
              '1 John 2:3-6',
              '1 John 3:14-18'
            ].map((verse, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                <span>{verse}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLesson1 = () => (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Lesson One: Where We Stand
        </h2>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Read These Passages
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            {['Romans 3:9-23', 'Isaiah 53:6', 'Jeremiah 17:9', 'Mark 7:20-23'].map((verse, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded">
                  {verse}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-8">
          Teaching
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The Bible's diagnosis of humanity is honest and severe. We are not spiritually neutral people who only need better information. We are sinners before a holy God. Sin is not merely weakness, brokenness, or poor judgment, though it includes all these things. Sin is rebellion against God, a refusal to love Him supremely and obey Him gladly.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Romans 3 teaches that all people, whether outwardly religious or openly irreligious, stand guilty before God. Paul gathers the whole human race under one verdict: "all have sinned and fall short of the glory of God." This means our deepest problem is not first social, emotional, educational, or economic. Our deepest problem is spiritual and moral. We have sinned against the God who made us.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Historic Christian theology has often described this condition as original sin and total depravity. Total depravity does not mean every person is as evil as possible. It means sin has affected every part of us: mind, heart, will, desires, words, actions, and relationships. We need more than improvement. We need rescue.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">A. Overview</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          To understand personal sin biblically, we must see both our guilt and our corruption. We have a bad record before God, and we have a bad heart within us.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          If we only had a bad record, we might imagine that pardon alone would be enough. If we only had a bad heart, we might imagine that inward renewal alone would be enough. But Scripture says we need both: forgiveness for our guilt and regeneration for our corruption.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">B. A Bad Record</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Our bad record means we are legally guilty before God. We have broken His law in what we have done and in what we have failed to do. We have sinned by commission and omission. We have loved other things more than God, used His gifts without gratitude, spoken wrongly, acted selfishly, and failed to love our neighbors as ourselves.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          God's judgment is not arbitrary. He is perfectly holy and perfectly just. A righteous judge cannot call evil good. If God ignored sin, He would not be good. Therefore, our guilt must be dealt with justly.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">C. A Bad Heart</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Our bad heart means sin is not only outside us in our behavior; it is inside us in our nature. Jesus teaches in Mark 7 that evil actions flow from the heart. Jeremiah says the heart is deceitful and desperately sick. We do not merely need new habits. We need new hearts.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          This is why moralism cannot save. A person may polish the outside of life while remaining inwardly unchanged. Biblical Christianity is not behavior modification. It is a new creation.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-4">Study Questions</h3>
          <ol className="space-y-3 text-amber-800 dark:text-amber-200 list-decimal list-inside">
            {[
              'Why is it dangerous to define "Christian" mainly by culture, family, or outward religion?',
              'What is the difference between having a bad record and having a bad heart?',
              'Why can moral effort never solve the deepest problem of sin?',
              'How does Romans 3 remove every ground of boasting before God?'
            ].map((q, idx) => (
              <li key={idx} className="leading-relaxed">{q}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  const renderLesson2 = () => (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Lesson Two: God's Solution
        </h2>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Read These Passages
          </h3>
          <ul className="space-y-2 text-green-800 dark:text-green-200">
            {['John 1:1-14', 'Romans 3:21-26', '2 Corinthians 5:17-21', '1 Peter 2:24', 'Hebrews 9:11-14'].map((verse, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs bg-green-200 dark:bg-green-800 px-2 py-1 rounded">
                  {verse}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-8">
          Teaching
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Because our problem is deeper than we can repair, God's solution must come from outside us. Christianity is not humanity climbing up to God. It is God coming down in mercy through Jesus Christ.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          The gospel is not first advice about what we must do for God. It is good news about what God has done for sinners in Christ. The divine remedy for sin is not a program, ritual, philosophy, or moral code. The remedy is a Person: the incarnate Son of God.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">A. In a Person</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Jesus Christ is fully God and fully man. This is essential to the gospel. As man, He can represent us. As God, His person and work have infinite worth. He is the last Adam, the true Israel, the obedient Son, the faithful covenant keeper, and the only Mediator between God and man.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Where Adam disobeyed, Christ obeyed. Where Israel failed, Christ fulfilled. Where we sinned, Christ remained righteous. His life was not merely preparation for the cross; His life was part of His saving work. He fulfilled all righteousness on behalf of His people.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">B. Centered in the Cross</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The cross is the center of God's remedy. At Calvary, Jesus bore the sins of His people and suffered in their place. This is the historic doctrine of substitutionary atonement. He did not die as a mere example of courage or love. He died as the Lamb of God who takes away the sin of the world.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Romans 3 says God put Christ forward as a propitiation by His blood. Propitiation means that God's righteous wrath against sin is satisfied through a sacrifice. At the cross, God remains just while justifying sinners who have faith in Jesus.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          This means forgiveness is not God pretending sin does not matter. Forgiveness is possible because sin has been judged in Christ. Mercy does not overthrow justice. Mercy comes through justice satisfied.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">C. Offered to All Men</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The gospel is to be proclaimed freely to all people. The invitation is sincere: repent and believe in the Lord Jesus Christ. No sinner is too guilty to come. No background is too stained. No conscience is too burdened. Christ is sufficient for all who come to Him.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          At the same time, the gospel must be personally received. Knowing about Christ is not the same as trusting Christ. Admiring the cross is not the same as resting your soul on the crucified and risen Savior.
        </p>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-4">Study Questions</h3>
          <ol className="space-y-3 text-purple-800 dark:text-purple-200 list-decimal list-inside">
            {[
              'Why must God\'s solution to sin come from outside of us?',
              'Why is it essential that Jesus is both fully God and fully man?',
              'What does the cross reveal about both God\'s justice and God\'s love?',
              'What is the difference between knowing gospel facts and personally trusting Christ?'
            ].map((q, idx) => (
              <li key={idx} className="leading-relaxed">{q}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  const renderLesson3 = () => (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Lesson Three: Complying with God's Terms
        </h2>

        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Read These Passages
          </h3>
          <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
            {['Mark 1:14-15', 'Acts 20:20-21', 'John 3:1-8', 'Ephesians 2:8-10', 'James 2:14-26', '1 John 2:3-6'].map((verse, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs bg-indigo-200 dark:bg-indigo-800 px-2 py-1 rounded">
                  {verse}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-8">
          Teaching
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          God provides the remedy, and God defines the response. The proper response to the gospel is repentance toward God and faith in the Lord Jesus Christ. These are not works by which we earn salvation. They are the necessary response of a heart awakened by grace.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Repentance and faith belong together. Repentance turns from sin; faith turns to Christ. Repentance renounces rebellion; faith rests in the Savior. Repentance says, "I was wrong." Faith says, "Christ is enough."
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">A. Repentance</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Repentance is more than regret. A person may regret consequences, embarrassment, or pain without hating sin itself. Biblical repentance is a Spirit-wrought change of mind and heart that leads to a change of direction.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The repentant person does not merely want relief from guilt. He wants reconciliation with God. He does not negotiate with sin as a friend. He begins to treat sin as an enemy.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Repentance does not mean instant perfection. It means a new posture. The believer still struggles, but no longer makes peace with sin.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">B. Faith</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Faith is more than agreeing that Christian doctrine is true. Saving faith is personal trust in Jesus Christ. It receives Him as Prophet, Priest, and King.
        </p>

        <ul className="space-y-4 mb-6 text-gray-700 dark:text-gray-300">
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">As Prophet,</span>
            <span>Christ teaches us the truth of God.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">As Priest,</span>
            <span>Christ offers Himself as the sacrifice for sin and intercedes for His people.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">As King,</span>
            <span>Christ rules and defends us, bringing our lives under His lordship.</span>
          </li>
        </ul>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Faith is the empty hand receiving Christ. It does not boast in itself. It does not trust in the strength of its own believing. It looks away from self and rests on Jesus.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">C. Always Together</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Repentance and faith are distinct but inseparable. The New Testament never imagines a person receiving Christ as Savior while permanently refusing Him as Lord. We are justified by faith alone, but the faith that justifies is never alone.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          This guards against two errors. Legalism says we are saved by our obedience. Antinomianism says obedience does not matter. The gospel rejects both. We are saved by grace through faith, and that grace produces a changed life.
        </p>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">D. Evidence of Being a Biblical Christian</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          The Bible encourages self-examination, not morbid introspection. We are not saved by evidences, but true salvation has evidences.
        </p>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Some marks of a biblical Christian include:
        </p>

        <ul className="space-y-3 mb-6 text-gray-700 dark:text-gray-300">
          {[
            { mark: 'A new relationship to sin', desc: 'The believer grieves over sin, confesses it, and fights against it.' },
            { mark: 'A new trust in Christ', desc: 'The believer rests in Christ\'s righteousness rather than personal merit.' },
            { mark: 'A new desire for obedience', desc: 'God\'s commands become a path of love, not a ladder to earn acceptance.' },
            { mark: 'A new love for God\'s people', desc: 'Love for other believers is a sign of passing from death to life.' },
            { mark: 'A new perseverance', desc: 'The believer continues in faith because God preserves His people.' },
            { mark: 'A new humility', desc: 'Grace kills boasting and produces gratitude.' }
          ].map((item, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="font-semibold text-primary-600 dark:text-primary-400 flex-shrink-0">•</span>
              <span>
                <span className="font-semibold">{item.mark}:</span> {item.desc}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          These evidences may be weak, imperfect, and growing slowly. But where God gives new life, there will be signs of life.
        </p>

        <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-6 mt-8">
          <h3 className="font-semibold text-rose-900 dark:text-rose-300 mb-4">Study Questions</h3>
          <ol className="space-y-3 text-rose-800 dark:text-rose-200 list-decimal list-inside">
            {[
              'What is the difference between worldly regret and biblical repentance?',
              'Why is saving faith more than intellectual agreement?',
              'Why must repentance and faith always be held together?',
              'Which evidence of new life do you see growing in your life?',
              'Where do you need to ask the Holy Spirit for deeper transformation?'
            ].map((q, idx) => (
              <li key={idx} className="leading-relaxed">{q}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );

  const renderApplication = () => (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Personal Application
        </h2>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          Take time to reflect honestly:
        </p>

        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-8">
          <ol className="space-y-4">
            {[
              'Am I assuming I am a Christian because of background, morality, or church involvement?',
              'Have I personally faced my bad record and bad heart before God?',
              'Am I trusting Jesus Christ alone as my Savior?',
              'Have I turned from sin in repentance, or am I trying to keep Christ and sin together?',
              'Do I see evidence of new spiritual life, even if imperfect and growing?',
              'What step of obedience is God calling me to take now?'
            ].map((q, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">{idx + 1}.</span>
                <span className="text-gray-700 dark:text-gray-300">{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
          Group Exercise
        </h2>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6">
          <p className="text-purple-800 dark:text-purple-200 font-semibold mb-3">
            Read Mark 1:14-15 and 2 Corinthians 5:17-21 aloud together.
          </p>
          <p className="text-purple-800 dark:text-purple-200 font-semibold mb-4">
            Then discuss:
          </p>
          <ul className="space-y-3 text-purple-800 dark:text-purple-200">
            {[
              'What false definitions of "Christian" are common today?',
              'Which part of the gospel is most often misunderstood: sin, Christ, repentance, faith, or new life?',
              'How can we speak about true conversion in a way that is both clear and compassionate?'
            ].map((q, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="flex-shrink-0">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <p className="text-purple-700 dark:text-purple-300 font-semibold mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
            Close by praying for honest self-examination, gospel clarity, and true faith in Christ.
          </p>
        </div>
      </div>
    </div>
  );

  const renderClosing = () => (
    <div className="space-y-6">
      <div className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Closing Encouragement
        </h2>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-8 mb-6">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            The purpose of this study is not to lead tender consciences into despair. It is to lead every reader away from false confidence and toward Jesus Christ. If you see your sin, do not hide from God. Come to Christ. He receives sinners. He forgives freely. He gives new hearts. He makes dead people alive.
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            If you are in Christ, rejoice. You are not a Christian because you earned the name. You are a Christian because God had mercy on you, united you to His Son, and began a work He will surely finish.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Closing Prayer
        </h2>

        <div className="bg-rose-50 dark:bg-rose-900/20 border-l-4 border-rose-500 p-8 rounded-r-lg">
          <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed font-serif">
            Holy God, show us the truth about ourselves and the glory of Your Son. Deliver us from false confidence, empty religion, and shallow definitions of Christianity. Bring us to true repentance and living faith. Give us new hearts by Your Spirit, and make our lives bear witness to the grace of Jesus Christ. Amen.
          </p>
        </div>
      </div>
    </div>
  );

  const getCurrentContent = () => {
    switch (currentLesson) {
      case 'intro':
        return renderIntroduction();
      case 'lesson1':
        return renderLesson1();
      case 'lesson2':
        return renderLesson2();
      case 'lesson3':
        return renderLesson3();
      case 'application':
        return renderApplication();
      case 'closing':
        return renderClosing();
      default:
        return renderIntroduction();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl">
          <Heart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Discipleship Study
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            What Is a Biblical Christian? • Teaching on faith, discipleship & conversion
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Study Sections
              </h3>
            </div>
            <nav className="p-2 space-y-1 max-h-[600px] overflow-y-auto">
              {lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setCurrentLesson(lesson.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    currentLesson === lesson.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1">
                      {lesson.section === 'lesson' ? '📖' : lesson.section === 'intro' ? '📌' : lesson.section === 'application' ? '✏️' : '🙏'}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium leading-tight">{lesson.title}</div>
                      {lesson.subtitle && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {lesson.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            {getCurrentContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={() => {
                const currentIdx = lessons.findIndex(l => l.id === currentLesson);
                if (currentIdx > 0) {
                  setCurrentLesson(lessons[currentIdx - 1].id);
                }
              }}
              disabled={currentLesson === lessons[0].id}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                currentLesson === lessons[0].id
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={() => {
                const currentIdx = lessons.findIndex(l => l.id === currentLesson);
                if (currentIdx < lessons.length - 1) {
                  setCurrentLesson(lessons[currentIdx + 1].id);
                }
              }}
              disabled={currentLesson === lessons[lessons.length - 1].id}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentLesson === lessons[lessons.length - 1].id
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
